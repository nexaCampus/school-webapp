// Admission-number screen logic. Mirrors AdmissionLoginViewModel: unknown
// numbers route to onboarding (locked) instead of dead-ending on an error.
import { getStudent, normalizeAdmissionNumber } from './firebase.js';
import { setSession } from './session.js';

const $ = (id) => document.getElementById(id);
const errBox = $('err');
const errText = $('err-text');

function showError(message) {
  if (!message) {
    errBox?.classList.add('hidden');
    return;
  }
  if (errText) errText.textContent = message;
  errBox?.classList.remove('hidden');
}

function setBusy(busy) {
  const btn = $('admission-btn');
  if (btn) btn.disabled = busy;
  $('admission-btn-busy')?.classList.toggle('hidden', !busy);
  $('admission-btn-idle')?.classList.toggle('hidden', busy);
}

$('admission-btn')?.addEventListener('click', async () => {
  const normalized = normalizeAdmissionNumber($('admission-input')?.value);
  if (normalized.length < 6) {
    showError('Enter the admission number from your ID card');
    return;
  }
  showError(null);
  setBusy(true);
  try {
    const profile = await getStudent(normalized);
    if (profile) {
      setSession({
        provider: 'admission',
        isNewAccount: false,
        name: profile.name,
        student: profile,
      });
      window.location.assign('/home.html');
    } else {
      const q = new URLSearchParams({ admissionNumber: normalized });
      window.location.assign(`/onboarding.html?${q.toString()}`);
    }
  } catch (e) {
    showError(e?.message || 'Could not verify that admission number');
  } finally {
    setBusy(false);
  }
});
