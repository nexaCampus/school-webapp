// Minimal session store. Mirrors the Android flow: after Clerk proves the
// identity, the Firebase roster (or a freshly onboarded profile) is cached
// here so every page renders instantly and guards can redirect when empty.

const KEY = 'nexacampus.school.session.v1';

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

/** Redirects to the chooser when no signed-in profile exists. Returns it otherwise. */
export function requireSessionOrRedirect(loginUrl = '/chooser.html') {
  const session = getSession();
  if (!session || !session.student) {
    window.location.replace(loginUrl);
    return null;
  }
  return session;
}
