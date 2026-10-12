/**
 * NexaCampus Session Facade
 * Delegates session management and reactive events to lib/state/sessionStore.ts.
 */

export * from './state/sessionStore';
import { clearSession } from './state/sessionStore';

/**
 * Fully logs out the active user:
 * 1. Purges the active session from localStorage & cookies
 * 2. Signs out of Firebase Auth (Google / Email)
 * 3. Clears transient sessionStorage
 * 4. Replaces browser history state and navigates to target destination (default: /chooser)
 */
export async function logoutUser(redirectTo = '/chooser'): Promise<void> {
  clearSession();
  try {
    const { signOutUser } = await import('./firebase');
    await signOutUser();
  } catch (err) {
    console.warn('[Session] Firebase sign-out warning:', err);
  }
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.clear();
      window.history.replaceState(null, '', redirectTo);
    } catch {}
    window.location.replace(redirectTo);
  }
}

/**
 * Switches the active student account:
 * 1. Purges active session so chooser and login methods start fresh
 * 2. Signs out of Firebase so account selector re-triggers
 * 3. Navigates cleanly to /chooser
 */
export async function switchAccount(): Promise<void> {
  await logoutUser('/chooser');
}
