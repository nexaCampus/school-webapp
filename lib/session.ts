// Minimal session store. Mirrors the Android flow: after Clerk proves the
// identity, the Firebase roster (or a freshly onboarded profile) is cached
// here so every page renders instantly and guards can redirect when empty.
import type { Student } from './data';

export interface Session {
  uid?: string;
  name: string;
  email?: string;
  provider: 'google' | 'email' | 'admission';
  isNewAccount: boolean;
  student: Student | null;
}

const KEY = 'nexacampus.school.session.v1';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getSession(): Session | null {
  try {
    const raw = storage()?.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  storage()?.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  storage()?.removeItem(KEY);
}
