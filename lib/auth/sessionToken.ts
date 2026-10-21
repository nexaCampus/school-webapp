/**
 * Signed session tokens for the edge guard.
 *
 * The portal session itself lives in the browser (Firebase + localStorage), but
 * the edge cannot read localStorage. Instead the Next.js server mints a signed,
 * HttpOnly cookie (`school_auth_token`) that the middleware verifies with an
 * HMAC-SHA256 signature. A client-writable cookie can be forged; a signed one
 * cannot.
 *
 * The implementation uses Web Crypto only, so the same code runs in the Node
 * route handler and in the Edge middleware.
 */

export interface SessionTokenPayload {
  /** Firebase uid (or creator phone) the session belongs to. */
  sub: string;
  /** 'student' | 'admin' | 'creator' */
  role: 'student' | 'admin' | 'creator';
  /** Tenant slug the session is bound to (empty for the platform root). */
  tenant: string;
  /** Issued-at / expiry (unix seconds). */
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = 'school_auth_token';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

/** Copies into a plain ArrayBuffer so it satisfies the Web Crypto BufferSource type. */
function toBufferSource(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(binary, 'binary').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  if (typeof atob === 'function') {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  return new Uint8Array(Buffer.from(padded, 'base64'));
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** Signs a session payload into a compact `payload.signature` token. */
export async function signSessionToken(
  payload: SessionTokenPayload,
  secret: string
): Promise<string> {
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    toBufferSource(encoder.encode(body))
  );
  return `${body}.${base64UrlEncode(new Uint8Array(signature))}`;
}

/**
 * Verifies a token and returns its payload, or null when the token is
 * malformed, tampered with or expired.
 */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string
): Promise<SessionTokenPayload | null> {
  if (!token || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  try {
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      toBufferSource(base64UrlDecode(signature)),
      toBufferSource(encoder.encode(body))
    );
    if (!valid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(body))
    ) as SessionTokenPayload;

    if (!payload || typeof payload.exp !== 'number') return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** True when the current page is served over HTTPS (drives the cookie Secure flag). */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;
  return window.location.protocol === 'https:';
}
