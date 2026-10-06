// New-student registration. Mirrors StudentOnboardingViewModel: validate,
// merge-write the Firestore record, cache the session, open the portal.
import { normalizeAdmissionNumber, saveStudent } from './firebase.js';
import { getSession, setSession } from './session.js';
import { student as mockStudent } from './data.js';

const $ = (id) => document.getElementById(id);
const errBox = $('err');
const errText = $('err-text');
const params = new URLSearchParams(window.location.search);

function showError(message) {
  if (!message) {
    errBox?.classList.add('hidden');
    return;
  }
  if (errText) errText.textContent = message;
  errBox?.classList.remove('hidden');
  errBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setBusy(busy) {
  const btn = $('save-btn');
  if (btn) btn.disabled = busy;
  $('save-btn-busy')?.classList.toggle('hidden', !busy);
  $('save-btn-idle')?.classList.toggle('hidden', busy);
}

function fillBlank(id, value) {
  const el = $(id);
  if (el && !el.value && value) el.value = value;
}

// Prefill: locked admission key from the admission path, name from Google,
// phone/email from whichever identity step supplied them. Blanks only.
(function prefill() {
  const admission = normalizeAdmissionNumber(params.get('admissionNumber'));
  const admissionInput = $('admission-input');
  if (admission && admissionInput) {
    admissionInput.value = admission;
    admissionInput.readOnly = true;
    $('admission-lock')?.classList.remove('hidden');
  }
  let pending = null;
  try {
    pending = JSON.parse(sessionStorage.getItem('pendingProfile') || 'null');
  } catch {
    pending = null;
  }
  const session = getSession();
  fillBlank('phone-input', params.get('phone') || '');
  fillBlank('name-input', params.get('name') || pending?.name || '');
  fillBlank('email-input', params.get('email') || pending?.email || session?.email || '');
  sessionStorage.removeItem('pendingProfile');
})();

document.querySelectorAll('[data-gender]').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelectorAll('[data-gender]').forEach((other) => {
      const on = other === el;
      other.classList.toggle('bg-primary', on);
      other.classList.toggle('text-white', on);
      other.classList.toggle('bg-surface-container-high', !on);
      other.classList.toggle('text-on-surface-variant', !on);
    });
    $('gender-input').value = el.dataset.gender;
    showError(null);
  });
});

$('save-btn')?.addEventListener('click', async () => {
  const admission = normalizeAdmissionNumber($('admission-input')?.value);
  const name = ($('name-input')?.value || '').trim();
  const grade = ($('grade-input')?.value || '').replace(/\D/g, '').slice(0, 2);
  const section = ($('section-input')?.value || '').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
  const gender = $('gender-input')?.value || '';
  const phone = ($('phone-input')?.value || '').replace(/\D/g, '').slice(-10);

  if (admission.length < 6) return showError('Enter the admission number from the ID card or fee receipt');
  if (!name) return showError("Enter the student's full name");
  if (!grade) return showError('Enter the class / grade (e.g. 12)');
  if (!section) return showError('Enter the section (e.g. E)');
  if (!gender) return showError("Select the student's gender");
  if (phone.length !== 10) return showError('Enter a valid 10-digit contact number');

  showError(null);
  setBusy(true);
  try {
    const profile = {
      ...mockStudent,
      id: admission,
      name,
      displayName: name,
      grade,
      section,
      rollNo: ($('roll-input')?.value || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || mockStudent.rollNo,
      dob: ($('dob-input')?.value || '').slice(0, 10) || mockStudent.dob,
      gender,
      contactPhone: `+91 ${phone}`,
      emergencyPhone: `+91 ${phone}`,
      fatherName: ($('father-input')?.value || '').trim().slice(0, 60) || mockStudent.fatherName,
      motherName: ($('mother-input')?.value || '').trim().slice(0, 60) || mockStudent.motherName,
      guardianEmail: ($('email-input')?.value || '').trim().slice(0, 80) || mockStudent.guardianEmail,
      residentialAddress: ($('address-input')?.value || '').trim().slice(0, 140) || mockStudent.residentialAddress,
      qrToken: `STU-LCGVM-${admission}-2026`,
    };
    const saved = await saveStudent(profile);
    const prev = getSession() || {};
    setSession({ ...prev, name: saved.name, student: saved, isNewAccount: false });
    window.location.assign('/home.html');
  } catch (e) {
    showError(e?.message || 'Could not save the profile. Try again.');
  } finally {
    setBusy(false);
  }
});
