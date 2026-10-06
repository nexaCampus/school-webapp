// OAuth landing page: completes the Google redirect, stores the session,
// routes new users to onboarding (name prefilled) and returning users home.
import { handleOAuthCallback } from './clerk.js';
import { setSession } from './session.js';
import { student as mockStudent } from './data.js';

const errBox = document.getElementById('err');
const errText = document.getElementById('err-text');

function fail(message) {
  if (errBox) errBox.classList.remove('hidden');
  if (errText) errText.textContent = message;
}

try {
  const { user, displayName, email, isNewAccount } = await handleOAuthCallback();
  if (isNewAccount) {
    sessionStorage.setItem(
      'pendingProfile',
      JSON.stringify({ name: displayName, email }),
    );
    setSession({
      clerkUserId: user.id,
      name: displayName,
      email,
      provider: 'google',
      isNewAccount: true,
      student: null,
    });
    window.location.replace('/onboarding.html');
  } else {
    setSession({
      clerkUserId: user.id,
      name: displayName || mockStudent.name,
      email: email || mockStudent.guardianEmail,
      provider: 'google',
      isNewAccount: false,
      // Same projection as Android: Clerk owns identity, the seeded profile
      // feeds every downstream screen until a Clerk-backed record exists.
      student: {
        ...mockStudent,
        name: displayName || mockStudent.name,
        displayName: displayName || mockStudent.displayName,
        guardianEmail: email || mockStudent.guardianEmail,
      },
    });
    window.location.replace('/home.html');
  }
} catch (e) {
  fail(e?.message || 'Google sign-in did not complete. Please try again.');
}
