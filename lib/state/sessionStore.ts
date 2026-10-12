/**
 * NexaCampus Reactive Session Store
 *
 * Implements observer pattern for session subscriptions, cross-tab synchronization,
 * and sliding 2-week inactivity persistence.
 */

import type { Student } from '../data';
import {
  TWO_WEEKS_MS,
  getStudentIdentifier,
  getStudentCache,
  purgeOldStudentCacheExcept,
  initOrRestoreStudentCache,
  setActiveStudentId,
} from '../cache/student-cache';

export interface Session {
  uid?: string;
  name: string;
  email?: string;
  provider: 'google' | 'email' | 'admission';
  isNewAccount: boolean;
  student: Student | null;
  lastActiveAt?: number;
  cachedAt?: number;
}

export type SessionListener = (session: Session | null) => void;

const KEY = 'nexacampus.school.session.v1';
const listeners = new Set<SessionListener>();

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function notify(session: Session | null): void {
  listeners.forEach((listener) => {
    try {
      listener(session);
    } catch (e) {
      console.warn('[SessionStore] Listener error:', e);
    }
  });
}

/**
 * Subscribes to session state changes. Returns an unsubscribe function.
 */
export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  // Emit current state immediately
  listener(getSession());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Retrieves the active session with sliding inactivity window check.
 */
export function getSession(): Session | null {
  const store = storage();
  if (!store) return null;

  try {
    const raw = store.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;

    const now = Date.now();
    const lastSeen = session.lastActiveAt || session.cachedAt || now;

    // 2-week inactivity logout guard
    if (now - lastSeen > TWO_WEEKS_MS) {
      clearSession();
      return null;
    }

    // Slide window forward
    session.lastActiveAt = now;

    // Rehydrate student cache if available
    if (session.student) {
      const studentId = getStudentIdentifier(session.student, session.email);
      const cached = getStudentCache(studentId);
      if (cached?.student) {
        session.student = { ...session.student, ...cached.student };
      }
    }

    store.setItem(KEY, JSON.stringify(session));
    if (typeof document !== 'undefined') {
      document.cookie = 'school_session_active=1; path=/; max-age=1209600; SameSite=Strict; Secure';
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Stores the session, handles account-switching cache isolation, and notifies subscribers.
 */
export function setSession(session: Session): void {
  const store = storage();
  if (!store) return;
  const now = Date.now();

  const currentStudentId = session.student
    ? getStudentIdentifier(session.student, session.email)
    : session.email || session.uid || '';

  if (currentStudentId) {
    purgeOldStudentCacheExcept(currentStudentId);
    setActiveStudentId(currentStudentId);
    if (session.student) {
      initOrRestoreStudentCache(session.student, session.email);
    }
  }

  const updated: Session = {
    ...session,
    cachedAt: session.cachedAt || now,
    lastActiveAt: now,
  };

  store.setItem(KEY, JSON.stringify(updated));
  if (typeof document !== 'undefined') {
    document.cookie = 'school_session_active=1; path=/; max-age=1209600; SameSite=Strict; Secure';
    try {
      localStorage.removeItem('nexacampus_jwt_token');
    } catch {}
  }

  notify(updated);
}

/**
 * Clears the active session and notifies subscribers.
 */
export function clearSession(): void {
  storage()?.removeItem(KEY);
  if (typeof document !== 'undefined') {
    document.cookie = 'school_session_active=; path=/; max-age=0; SameSite=Strict; Secure';
    document.cookie = 'school_auth_token=; path=/; max-age=0; SameSite=Strict; Secure';
    try {
      localStorage.removeItem('nexacampus_jwt_token');
    } catch {}
  }
  notify(null);
}

// Setup cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      notify(getSession());
    }
  });
}
