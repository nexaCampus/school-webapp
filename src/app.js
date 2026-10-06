// Shared shell behaviour: bottom-tab highlight (same convention as the
// Stitch inline scripts: anchors carry data-path, body carries
// data-active-tab), plus small navigation helpers.
import { requireSessionOrRedirect } from './session.js';

const ACTIVE = ['bg-primary', 'text-on-primary', 'shadow-[0_10px_24px_-4px_rgba(59,73,223,0.38)]'];

export function initShell() {
  const active = document.body?.dataset?.activeTab;
  if (!active) return;
  document.querySelectorAll('nav a[data-path]').forEach((anchor) => {
    const on = anchor.getAttribute('data-path') === active;
    ACTIVE.forEach((cls) => anchor.classList.toggle(cls, on));
    anchor.classList.toggle('text-on-surface-variant', !on);
    if (on) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
}

export function guardOrRedirect() {
  return requireSessionOrRedirect('/chooser.html');
}

export function go(url) {
  window.location.assign(url);
}
