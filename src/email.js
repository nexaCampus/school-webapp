// Email + Google screen logic. Mirrors GoogleEmailAuthViewModel: mode tabs,
// Google redirect, email sign-in, email sign-up + code stage with resend.
import {
  emailResendCode,
  emailSignIn,
  emailSignUpStart,
  emailVerifyCode,
  getClerk,
  googleStart,
  withSignUpHint,
} from './clerk.js';
import { setSession } from './session.js';
import { student as mockStudent } from './data.js';

const $ = (id) => document.getElementById(id);
const errBox = $('err');
const errText = $('err-text');

let mode = 'signin'; // 'signin' | 'signup'
let resendAt = 0;
let resendTimer = null;

function showError(message) {
  if (!message) {
    errBox?.classList.add('hidden');
    return;
  }
  if (errText) errText.textContent = message;
  errBox?.classList.remove('hidden');
}

function setBusy(busy) {
  ['google-btn', 'email-btn', 'code-btn'].forEach((id) => {
    const el = $(id);
    if (el) el.disabled = busy;
  });
  document.querySelectorAll('[data-busy-label]').forEach((el) => {
    el.classList.toggle('hidden', !busy);
  });
  document.querySelectorAll('[data-idle-label]').forEach((el) => {
    el.classList.toggle('hidden', busy);
  });
}

function setMode(next) {
  mode = next;
  showError(null);
  $('cred-stage')?.classList.remove('hidden');
  const codeStage = $('code-stage');
  codeStage?.classList.add('hidden');
  codeStage?.classList.remove('flex');
  document.querySelectorAll('[data-mode-tab]').forEach((el) => {
    const on = el.dataset.modeTab === next;
    el.classList.toggle('bg-surface-container-lowest', on);
    el.classList.toggle('shadow-sm', on);
    el.classList.toggle('text-on-surface', on);
    el.classList.toggle('text-on-surface-variant', !on);
  });
  const btn = $('email-btn-label');
  if (btn) btn.textContent = next === 'signin' ? 'Sign In' : 'Create Account';
}

$('password-toggle')?.addEventListener('click', () => {
  const input = $('password-input');
  const icon = $('password-toggle-icon');
  if (!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  if (icon) icon.textContent = show ? 'visibility_off' : 'visibility';
});

// Hide the warmup note once the Clerk SDK is actually ready.
getClerk()
  .then(() => $('clerk-warmup')?.classList.add('hidden'))
  .catch(() => {});

function startResendTimer() {
  resendAt = Date.now() + 45_000;
  clearInterval(resendTimer);
  tickResend();
  resendTimer = setInterval(tickResend, 500);
}

function tickResend() {
  const left = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
  const label = $('resend-label');
  if (label) {
    label.textContent =
      left > 0 ? `Resend code in 00:${String(left).padStart(2, '0')}` : 'You can request a new code';
  }
  const btn = $('resend-btn');
  if (btn) btn.disabled = left > 0;
  if (left <= 0) clearInterval(resendTimer);
}

function existingSession(clerkUserId, email) {
  return {
    clerkUserId,
    name: mockStudent.name,
    email,
    provider: 'email',
    isNewAccount: false,
    student: { ...mockStudent, guardianEmail: email || mockStudent.guardianEmail },
  };
}

document.querySelectorAll('[data-mode-tab]').forEach((el) => {
  el.addEventListener('click', () => setMode(el.dataset.modeTab));
});

$('google-btn')?.addEventListener('click', async () => {
  showError(null);
  setBusy(true);
  try {
    await googleStart();
    // Browser leaves for Google; resume happens on sso-callback.html.
  } catch (e) {
    setBusy(false);
    showError(e?.message || 'Google sign-in failed. Try again.');
  }
});

$('email-btn')?.addEventListener('click', async () => {
  const email = ($('email-input')?.value || '').trim();
  const password = $('password-input')?.value || '';
  if (!email.includes('@')) return showError('Enter a valid email address');
  if (password.length < 8) return showError('Password must be at least 8 characters');
  showError(null);
  setBusy(true);
  try {
    if (mode === 'signin') {
      const { clerk } = await emailSignIn(email, password);
      setSession(existingSession(clerk.user.id, email));
      window.location.assign('/home.html');
    } else {
      const { status } = await emailSignUpStart(email, password);
      if (status === 'complete') {
        const clerk = await getClerk();
        setSession({ ...existingSession(clerk.user.id, email), isNewAccount: true, student: null });
        window.location.assign('/onboarding.html');
      } else {
        $('cred-stage')?.classList.add('hidden');
        const codeStage = $('code-stage');
        codeStage?.classList.remove('hidden');
        codeStage?.classList.add('flex');
        const sent = $('code-sent-to');
        if (sent) sent.textContent = email;
        startResendTimer();
      }
    }
  } catch (e) {
    showError(mode === 'signin' ? withSignUpHint(e?.message) : e?.message || 'Something went wrong. Try again.');
  } finally {
    setBusy(false);
  }
});

$('code-btn')?.addEventListener('click', async () => {
  const code = ($('code-input')?.value || '').replace(/\D/g, '').slice(0, 6);
  if (code.length !== 6) return showError('Enter the complete 6-digit code');
  showError(null);
  setBusy(true);
  try {
    await emailVerifyCode(code);
    const clerk = await getClerk();
    const email = ($('email-input')?.value || '').trim();
    setSession({ ...existingSession(clerk.user.id, email), isNewAccount: true, student: null });
    window.location.assign('/onboarding.html');
  } catch (e) {
    showError(e?.message || 'Verification failed. Try again.');
  } finally {
    setBusy(false);
  }
});

$('resend-btn')?.addEventListener('click', async () => {
  showError(null);
  try {
    await emailResendCode();
    startResendTimer();
  } catch (e) {
    showError(e?.message || 'Could not resend the code. Try again.');
  }
});

setMode('signin');
