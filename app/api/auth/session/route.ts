import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  type SessionTokenPayload,
} from '@/lib/auth/sessionToken';
import { SHARED_COOKIE_DOMAIN } from '@/lib/tenantUrls';

/**
 * Mints and clears the signed session cookie that the edge guard trusts.
 *
 * POST  /api/auth/session  { mode: 'firebase', idToken, tenant? }
 * POST  /api/auth/session  { mode: 'admission', admissionNumber, tenant? }
 * POST  /api/auth/session  { mode: 'creator', phone, token, tenant? }
 * DELETE /api/auth/session
 *
 * Every mode is verified server-side before a cookie is issued:
 *  - firebase  -> the Firebase ID token is checked against the Identity Toolkit
 *  - admission -> the admission number is checked against the Go backend roster
 *  - creator   -> the SchoolMaker creator token is checked against the Go backend
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sessionSecret(): string {
  return (process.env.SESSION_SECRET || '').trim();
}

function goApiBase(): string {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return process.env.NEXT_PUBLIC_LOCAL_GO_API_URL || 'http://localhost:8080';
  }
  return (
    process.env.NEXT_PUBLIC_GO_API_URL ||
    process.env.GO_BACKEND_URL ||
    'https://backend-school-go.onrender.com'
  );
}

async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string; email: string } | null> {
  const apiKey = (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '').trim();
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      users?: { localId?: string; email?: string }[];
    };
    const user = data.users?.[0];
    if (!user?.localId) return null;
    return { uid: user.localId, email: user.email || '' };
  } catch {
    return null;
  }
}

async function verifyAgainstGoBackend(
  body: Record<string, unknown>
): Promise<{ uid: string; role: 'student' | 'creator'; email: string } | null> {
  const base = goApiBase().replace(/\/$/, '');
  const mode = body.mode;

  try {
    if (mode === 'admission') {
      const admissionNumber = String(body.admissionNumber || '').trim();
      if (!admissionNumber) return null;
      const res = await fetch(`${base}/api/v1/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_slug: String(body.tenant || '').trim(),
          admission_number: admissionNumber,
        }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { success?: boolean; role?: string; token?: string };
      if (!data.success) return null;
      return { uid: admissionNumber, role: 'student', email: '' };
    }

    if (mode === 'creator') {
      const phone = String(body.phone || '').trim();
      const token = String(body.token || '').trim();
      if (!phone || !token) return null;
      const res = await fetch(`${base}/api/v1/maker/auth/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, token }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { success?: boolean; creator_name?: string };
      if (!data.success) return null;
      return { uid: phone, role: 'creator', email: '' };
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  const secret = sessionSecret();
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'SESSION_SECRET is not configured on the server' },
      { status: 503 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const mode = String(body.mode || 'firebase');
  const tenant = String(body.tenant || '').trim().toLowerCase();

  let identity: { uid: string; role: 'student' | 'admin' | 'creator'; email: string } | null = null;

  if (mode === 'firebase') {
    const idToken = String(body.idToken || '').trim();
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'A Firebase ID token is required' },
        { status: 401 }
      );
    }
    const verified = await verifyFirebaseIdToken(idToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'The Firebase session could not be verified' },
        { status: 401 }
      );
    }
    identity = { uid: verified.uid, role: 'student', email: verified.email };
  } else {
    const verified = await verifyAgainstGoBackend({ ...body, mode, tenant });
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'The credentials could not be verified' },
        { status: 401 }
      );
    }
    identity = verified;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionTokenPayload = {
    sub: identity.uid,
    role: identity.role,
    tenant,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const token = await signSessionToken(payload, secret);
  const response = NextResponse.json({ success: true, role: payload.role, tenant: payload.tenant });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: SHARED_COOKIE_DOMAIN,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: SHARED_COOKIE_DOMAIN,
    maxAge: 0,
  });
  return response;
}
