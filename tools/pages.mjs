// Page builder: Stitch HTML in, shippable pages out. Nothing inside the
// Stitch markup is restyled — the script only (1) injects <title> +
// shell.css into <head>, (2) drops page-local inline scripts in favour of
// shared modules, (3) rewrites placeholder nav hrefs, (4) stamps body
// attributes the shared shell reads, and (5) appends the page module.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STITCH = 'C:/Users/parth/Downloads/school/stitch_school_portal_app_redesign';

const NAV = {
  home: 'home.html',
  academics: 'academics.html',
  notices: 'notices.html',
  profile: 'profile.html',
  diary: 'diary.html',
  helpdesk: 'helpdesk.html',
};

function sliceBetween(src, start, end) {
  const i = src.indexOf(start);
  const j = src.indexOf(end, i);
  if (i < 0 || j < 0) throw new Error(`marker missing: ${start} / ${end}`);
  return src.slice(i, j + end.length);
}

function injectHead(html, { title }) {
  const tag = `<title>${title} · NexaCampus School</title>\n<link rel="stylesheet" href="/src/shell.css">`;
  if (!html.includes('</head>')) throw new Error('no </head>');
  return html.replace('</head>', `${tag}</head>`);
}

function stampBody(html, { activeTab, guard }) {
  return html.replace(
    '<body',
    `<body data-active-tab="${activeTab}"${guard ? ' data-guard="1"' : ''}`,
  );
}

function rewriteNav(html) {
  // <a ... data-path="home" href="#"> -> real page link. Unknown paths keep #.
  return html.replace(
    /<a([^>]*?)data-path="([a-z]+)"([^>]*?)href="#"/g,
    (m, pre, path, post) => (NAV[path] ? `<a${pre}data-path="${path}"${post}href="${NAV[path]}"` : m),
  );
}

function stripInlineScripts(html) {
  // Page-local Stitch scripts (e.g. hardcoded tab highlighters) are replaced
  // by shared modules so every page behaves the same. Matched per-block so
  // the match can never span two <script> elements, and the Tailwind token
  // config block is explicitly preserved — it IS the design system.
  return html.replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/g, (block) => {
    if (block.includes('tailwind.config')) return block;
    if (block.includes('DOMContentLoaded')) return '';
    return block;
  });
}

function appendModule(html, src) {
  if (!src) return html;
  return html.replace('</body>', `<script type="module" src="${src}"></script></body>`);
}

function sharedHeader(title) {
  const home = readFileSync(`${STITCH}/home_dashboard/code.html`, 'utf8');
  const header = sliceBetween(home, '<header', '</header>');
  return header
    .replace('>Home</span>', `>${title}</span>`)
    .replace('href="#"', 'href="notices.html"', 1);
}

function sharedNav() {
  const home = readFileSync(`${STITCH}/home_dashboard/code.html`, 'utf8');
  let nav = sliceBetween(home, '<nav', '</nav>');
  nav = rewriteNav(nav);
  // Neutralise the hardcoded active tab; shared app.js highlights per page.
  nav = nav.replaceAll(
    'bg-primary text-on-primary shadow-[0_10px_24px_-4px_rgba(59,73,223,0.38)]',
    'text-on-surface-variant',
  );
  return nav;
}

/** Port a whole Stitch screen 1:1. */
function port({ from, out, title, activeTab, guard = true, module = '/src/page.js' }) {
  let html = readFileSync(`${STITCH}/${from}`, 'utf8');
  html = injectHead(html, { title });
  html = stripInlineScripts(html);
  html = rewriteNav(html);
  html = stampBody(html, { activeTab, guard });
  html = appendModule(html, module);
  writeFileSync(resolve(ROOT, out), html);
  console.log('port   ', out);
}

/** Compose a page from the login base: shared head, no header/nav. */
function composeBare({ main, out, title, module }) {
  const base = readFileSync(`${STITCH}/login_student_verification/code.html`, 'utf8');
  const openTag = '<main class="flex-1 flex flex-col relative w-full pt-safe pb-safe bg-surface">';
  const i = base.indexOf(openTag);
  const j = base.indexOf('</main>', i);
  if (i < 0 || j < 0) throw new Error('main block missing in base');
  const fragment = readFileSync(resolve(ROOT, main), 'utf8');
  let html = `${base.slice(0, i + openTag.length)}\n${fragment}\n${base.slice(j)}`;
  html = injectHead(html, { title });
  html = stripInlineScripts(html);
  html = stampBody(html, { activeTab: '', guard: false });
  html = appendModule(html, module);
  writeFileSync(resolve(ROOT, out), html);
  console.log('compose', out);
}

/** Compose a full module page: shared header + main fragment + shared nav. */
function composeModule({ main, out, title, activeTab, guard = true, module = '/src/page.js' }) {
  const base = readFileSync(`${STITCH}/home_dashboard/code.html`, 'utf8');
  const bodyOpen = '<body class="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col relative">';
  const i = base.indexOf(bodyOpen);
  if (i < 0) throw new Error('body open missing in base');
  const head = base.slice(0, i);
  const fragment = readFileSync(resolve(ROOT, main), 'utf8');
  let html =
    `${head}${bodyOpen}\n${sharedHeader(title)}\n` +
    `<main class="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">\n${fragment}\n</main>\n` +
    `${sharedNav()}\n</body></html>`;
  html = injectHead(html, { title });
  html = stampBody(html, { activeTab, guard });
  html = appendModule(html, module);
  writeFileSync(resolve(ROOT, out), html);
  console.log('module ', out);
}

// ---- 1:1 Stitch ports (Pixel-faithful. Untouched markup.) ----
port({ from: 'home_dashboard/code.html', out: 'home.html', title: 'Home', activeTab: 'home' });
port({ from: 'academics_fee_services/code.html', out: 'academics.html', title: 'Academics & Fees', activeTab: 'academics' });
port({ from: 'homework_student_diary/code.html', out: 'diary.html', title: 'Homework Diary', activeTab: 'diary' });
port({ from: 'notice_board_circulars/code.html', out: 'notices.html', title: 'Notice Board', activeTab: 'notices' });
port({ from: 'student_profile_settings/code.html', out: 'profile.html', title: 'Profile', activeTab: 'profile' });
port({ from: 'write_to_school_helpdesk/code.html', out: 'helpdesk.html', title: 'Write to School', activeTab: '' });

// ---- Auth flow (composed from Android layouts, Stitch tokens) ----
composeBare({ main: 'fragments/splash.main.html', out: 'index.html', title: 'NexaCampus School', module: '/src/splash.js' });
composeBare({ main: 'fragments/chooser.main.html', out: 'chooser.html', title: 'Sign In', module: null });
composeBare({ main: 'fragments/email.main.html', out: 'email.html', title: 'Sign In', module: '/src/email.js' });
composeBare({ main: 'fragments/admission.main.html', out: 'admission.html', title: 'Admission Number', module: '/src/admission.js' });
composeBare({ main: 'fragments/onboarding.main.html', out: 'onboarding.html', title: 'New Student Registration', module: '/src/onboarding.js' });
composeBare({ main: 'fragments/sso-callback.main.html', out: 'sso-callback.html', title: 'Signing In', module: '/src/sso-callback.js' });

// ---- Module pages (token-faithful compositions; no Stitch source exists) ----
for (const [name, title] of [
  ['attendance', 'Attendance & Leave'],
  ['bus', 'Live Bus Tracking'],
  ['timetable', 'Timetable'],
  ['library', 'School Library'],
  ['exams', 'Exams & Hall Ticket'],
  ['canteen', 'Canteen Wallet'],
  ['ptm', 'PTM Scheduler'],
  ['hallpass', 'Digital Hall Pass'],
  ['health', 'Infirmary & Health'],
  ['merits', 'House & Merits'],
  ['store', 'School Store'],
  ['lostfound', 'Lost & Found'],
  ['gallery', 'Gallery & Yearbook'],
  ['clubs', 'Clubs & Societies'],
]) {
  composeModule({ main: `fragments/${name}.main.html`, out: `${name}.html`, title, activeTab: '' });
}
