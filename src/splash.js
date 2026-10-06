// Splash sequencing mirrors Android SplashScreen: staged progress labels,
// smooth bar, tap-to-skip, then the chooser. Splash never needs a session.
const stages = [
  { pct: 64, label: 'Initializing secure portal...' },
  { pct: 72, label: 'Syncing academic timetable...' },
  { pct: 89, label: 'Decrypting attendance logs...' },
  { pct: 98, label: 'Readying dashboard experience...' },
  { pct: 100, label: 'Welcome to Lions Portal' },
];

let done = false;
function finish() {
  if (done) return;
  done = true;
  window.location.replace('/chooser.html');
}

document.addEventListener('click', finish);

const bar = document.getElementById('splash-bar');
const label = document.getElementById('splash-label');
const pct = document.getElementById('splash-pct');

(async () => {
  const waits = [500, 600, 600, 600, 500];
  for (let i = 0; i < stages.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, waits[i - 1]));
    if (done) return;
    const s = stages[i];
    if (bar) bar.style.width = `${s.pct}%`;
    if (label) label.textContent = s.label;
    if (pct) pct.textContent = `${s.pct}%`;
  }
  await new Promise((r) => setTimeout(r, waits[waits.length - 1]));
  finish();
})();
