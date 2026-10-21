/**
 * NexaCampus Reactive Session Store
 *
 * Implements observer pattern for session subscriptions, cross-tab synchronization,
 * and sliding 2-week inactivity persistence.
 */

import type { Student } from '../data';
import { SHARED_COOKIE_DOMAIN } from '../tenantUrls';
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
 * The Secure attribute is only honoured (and only correct) over HTTPS.
 * Applying it on http://localhost makes the browser drop the cookie, which used
 * to leave the edge guard without any session indicator during local dev.
 */
function secureCookieSuffix(): string {
  if (typeof window === 'undefined') return '';
  return window.location.protocol === 'https:' ? '; Secure' : '';
}

/**
 * Scopes the client-written cookies to the shared parent domain so they are
 * still present on the tenant subdomain after the canonical redirect.
 */
function sharedCookieDomainSuffix(): string {
  if (typeof window === 'undefined') return '';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  return `; domain=${SHARED_COOKIE_DOMAIN ?? ''}`;
}

/**
 * Asks the Next.js server to mint the signed, HttpOnly session cookie that the
 * edge guard verifies. The request is best-effort: the portal still works
 * client-side if the server cannot be reached.
 */
async function issueSignedSession(session: Session): Promise<void> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;

  try {
    // Firebase-backed sessions prove themselves with an ID token.
    const { getAuthUser } = await import('../firebase');
    const user = getAuthUser();
    if (user) {
      const idToken = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'firebase',
          idToken,
          tenant: readTenantSlug(),
        }),
      });
      return;
    }

    // Admission-number sessions are validated server-side against the roster.
    const admissionNumber = session.student?.id || '';
    if (!admissionNumber) return;
    await fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'admission',
        admissionNumber,
        tenant: readTenantSlug(),
      }),
    });
  } catch {
    // Non-fatal: the client session remains valid for the current tab.
  }
}

function readTenantSlug(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)school_tenant_slug=([^;]+)/);
  return match?.[1]?.trim().toLowerCase() || '';
}

/**
 * Re-issues the signed session cookie when it is missing (e.g. after a deploy
 * that rotated the secret, or a session restored from localStorage).
 */
export function refreshSignedSession(): void {
  const session = getSession();
  if (session) void issueSignedSession(session);
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
      document.cookie = `school_session_active=1; path=/; max-age=1209600; SameSite=Strict${secureCookieSuffix()}${sharedCookieDomainSuffix()}`;
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
    document.cookie = `school_session_active=1; path=/; max-age=1209600; SameSite=Strict${secureCookieSuffix()}${sharedCookieDomainSuffix()}`;
    try {
      localStorage.removeItem('nexacampus_jwt_token');
    } catch {}
  }

  // Mint the signed, HttpOnly session cookie the edge guard verifies.
  void issueSignedSession(updated);

  notify(updated);
}

/**
 * Clears the active session and notifies subscribers.
 */
export function clearSession(): void {
  storage()?.removeItem(KEY);
  if (typeof document !== 'undefined') {
    document.cookie = `school_session_active=; path=/; max-age=0; SameSite=Strict${secureCookieSuffix()}${sharedCookieDomainSuffix()}`;
    document.cookie = `school_auth_token=; path=/; max-age=0; SameSite=Strict${secureCookieSuffix()}`;
    try {
      localStorage.removeItem('nexacampus_jwt_token');
    } catch {}
  }
  // Drop the server-issued signed session too.
  if (typeof fetch !== 'undefined') {
    void fetch('/api/auth/session', { method: 'DELETE', credentials: 'include' }).catch(() => {});
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
