// Shared module for every content page: tab highlight + session guard.
// Ported Stitch pages already carry production sample data in markup (Rajen
// Shaw, 12-E), exactly like the Android mock-backed screens, so no
// data-fill pass is needed for parity.
import { initShell } from './app.js';
import { getSession } from './session.js';

initShell();

if (document.body?.dataset?.guard === '1') {
  const session = getSession();
  if (!session || !session.student) {
    window.location.replace('/chooser.html');
  }
}
