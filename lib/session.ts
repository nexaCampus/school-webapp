// Session store with sliding 2-week inactivity persistence & student cache management.
// Automatically maintains the 2-week active window while the user visits the site.
// If the user is inactive for > 2 weeks, they are automatically logged out.
// If the same user logs in again, their cached student details, diary, and timetable are reused.
// If a different student logs in, the old student's cache is purged for security and privacy.
import type { Student } from './data';
import {
  TWO_WEEKS_MS,
  getStudentIdentifier,
  getActiveStudentId,
  setActiveStudentId,
  purgeOldStudentCacheExcept,
  initOrRestoreStudentCache,
  getStudentCache,
} from './studentCache';

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

const KEY = 'nexacampus.school.session.v1';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session.
 * - Enforces the 2-week inactivity rule: logs out if the user hasn't seen the site for > 2 weeks.
 * - Otherwise, updates lastActiveAt (sliding 2-week window so ongoing visits stay logged in).
 * - Rehydrates student data from the student cache if needed.
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

    // Slide the 2-week window forward since user is viewing the website right now
    session.lastActiveAt = now;

    // If session has a student, restore latest cached student data if available
    if (session.student) {
      const studentId = getStudentIdentifier(session.student, session.email);
      const cached = getStudentCache(studentId);
      if (cached?.student) {
        session.student = { ...session.student, ...cached.student };
      }
    }

    store.setItem(KEY, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}

/**
 * Stores the session.
 * - Detects account switching: if a different student logs in, purges the old student's cached data.
 * - If the same student logs in again, restores their cached data (timetable, diary, important dates).
 * - Records timestamps for the 2-week persistence window.
 */
export function setSession(session: Session): void {
  const store = storage();
  if (!store) return;
  const now = Date.now();

  const currentStudentId = session.student
    ? getStudentIdentifier(session.student, session.email)
    : (session.email || session.uid || '');

  const previousActiveId = getActiveStudentId();

  // If someone else's account is opened on this device, delete the old student's data!
  if (previousActiveId && currentStudentId && previousActiveId !== currentStudentId) {
    purgeOldStudentCacheExcept(currentStudentId);
  }

  if (currentStudentId) {
    setActiveStudentId(currentStudentId);
  }

  // If student profile exists, initialize or restore their cached records
  let hydratedStudent = session.student;
  if (session.student) {
    const cache = initOrRestoreStudentCache(session.student, session.email);
    hydratedStudent = cache.student;
  }

  const updatedSession: Session = {
    ...session,
    student: hydratedStudent,
    lastActiveAt: now,
    cachedAt: session.cachedAt || now,
  };

  store.setItem(KEY, JSON.stringify(updatedSession));
}

export function clearSession(): void {
  storage()?.removeItem(KEY);
}
