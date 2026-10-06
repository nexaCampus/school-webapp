// Clerk for the web twin (vanilla @clerk/clerk-js, no framework).
// Mirrors GoogleEmailAuthViewModel: Google OAuth redirect + email/password
// with email-code verification. Phone OTP is retired everywhere — Clerk does
// not deliver SMS to India on this instance.
import { Clerk } from '@clerk/clerk-js';

let clerkPromise = null;

export function getClerk() {
  if (!clerkPromise) {
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (!key) {
      return Promise.reject(
        new Error('Missing VITE_CLERK_PUBLISHABLE_KEY — copy school-webapp/.env.example to .env'),
      );
    }
    const instance = new Clerk(key);
    clerkPromise = instance.load().then(() => instance);
  }
  return clerkPromise;
}

export function displayNameOf(user) {
  if (!user) return '';
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
}

export function primaryEmailOf(user) {
  if (!user) return '';
  return (
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    ''
  );
}

/** Starts Google sign-in in a browser redirect. Resumes on sso-callback.html. */
export async function googleStart() {
  const clerk = await getClerk();
  const redirectUrl = `${window.location.origin}/sso-callback.html`;
  const signIn = await clerk.client.signIn.create({
    strategy: 'oauth_google',
    redirectUrl,
  });
  await signIn.authenticateWithRedirect({ continueSignUp: true });
}

/**
 * Runs on sso-callback.html. Completes the redirect, activates the session,
 * and reports whether the Clerk user was just created (heuristic: createdAt
 * within the last few minutes) so the app can route new users to onboarding.
 */
export async function handleOAuthCallback() {
  const clerk = await getClerk();
  let navigatedTo = null;
  await clerk.handleRedirectCallback(
    {
      signInFallbackRedirectUrl: `${window.location.origin}/home.html`,
      signUpFallbackRedirectUrl: `${window.location.origin}/onboarding.html`,
    },
    async (to) => {
      navigatedTo = to;
    },
  );
  const user = clerk.user;
  if (!user) throw new Error('Google sign-in did not complete. Please try again.');
  const ageMs = Date.now() - new Date(user.createdAt).getTime();
  return {
    clerk,
    user,
    displayName: displayNameOf(user),
    email: primaryEmailOf(user),
    isNewAccount: ageMs < 5 * 60 * 1000,
    fallbackTarget: navigatedTo,
  };
}

/** Email + password sign-in. Resolves to { isNewAccount: false }. */
export async function emailSignIn(email, password) {
  const clerk = await getClerk();
  const signIn = await clerk.client.signIn.create({ identifier: email, password });
  if (signIn.status !== 'complete') {
    throw new Error(
      'This account needs an extra verification step. Finish it in the Clerk Account Portal, then sign in again.',
    );
  }
  await clerk.setActive({ session: signIn.createdSessionId });
  return { clerk, isNewAccount: false };
}

/**
 * Email + password registration. Resolves to { status: 'complete' } or
 * { status: 'needs_code' } when an email verification code was dispatched.
 */
export async function emailSignUpStart(email, password) {
  const clerk = await getClerk();
  const signUp = await clerk.client.signUp.create({ emailAddress: email, password });
  if (signUp.status === 'complete') {
    await clerk.setActive({ session: signUp.createdSessionId });
    return { clerk, status: 'complete' };
  }
  await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
  return { clerk, status: 'needs_code' };
}

export async function emailVerifyCode(code) {
  const clerk = await getClerk();
  const signUp = clerk.client.signUp;
  const attempt = await signUp.attemptEmailAddressVerification({ code });
  if (attempt.status !== 'complete') {
    throw new Error('That code did not complete registration. Request a new one.');
  }
  await clerk.setActive({ session: attempt.createdSessionId });
  return { clerk, isNewAccount: true };
}

export async function emailResendCode() {
  const clerk = await getClerk();
  await clerk.client.signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
}

export async function signOut() {
  const clerk = await getClerk();
  await clerk.signOut();
}

/** Friendly hint when sign-in fails because the email was never registered. */
export function withSignUpHint(message) {
  const m = message || 'Sign-in failed. Try again.';
  const looksUnknown =
    /not find|not found|does not exist/i.test(m);
  return looksUnknown ? `${m} Switch to Create account if this email was never registered.` : m;
}
