// NexaCampus Hardened API Client
// Implements 20-Point Security Alignment (HttpOnly Cookie Auth, CSRF, IDOR 403 detection, Rate Limiting 429 backoff)

import { getCsrfHeaders } from './security';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_GO_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== 'undefined' ? '' : 'http://localhost:8080');

export interface ApiClientResponse<T> {
  data: T;
  isLive: boolean;
  status?: number;
  error?: string;
  isRateLimited?: boolean;
  isForbidden?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Silent Token Rotation (POST /v1/auth/refresh)
 * Dispatches credentials with CSRF headers to renew the HttpOnly session cookie.
 */
async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders(),
        },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/**
 * Core hardened fetch wrapper for all server-side communications.
 * Enforces credentials: 'include', CSRF headers, 401 retry, 403 IDOR notification, 429 rate limit backoff.
 */
export async function secureFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData: T,
  retryCount = 0
): Promise<ApiClientResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, {
      ...options,
      credentials: 'include', // Send and receive HttpOnly cookies (Points 1, 12)
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfHeaders(), // X-Requested-With: XMLHttpRequest (Point 3)
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // 1. Silent token refresh on 401 Unauthorized (Point 1)
    if (res.status === 401 && retryCount === 0) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        return secureFetch(endpoint, options, fallbackData, retryCount + 1);
      }
      return {
        data: fallbackData,
        isLive: false,
        status: 401,
        error: 'Session expired. Please log in again.',
      };
    }

    // 2. 403 Forbidden - IDOR or Permission Violation (Point 5, Point 13)
    if (res.status === 403) {
      console.warn(`[Security Alert] 403 Forbidden access to ${endpoint} - potential IDOR violation or insufficient role.`);
      return {
        data: fallbackData,
        isLive: false,
        status: 403,
        isForbidden: true,
        error: 'Access Denied: You do not have permission to view or modify this record.',
      };
    }

    // 3. 429 Too Many Requests - Rate Limit Exceeded (Point 6)
    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After') || '60';
      console.warn(`[Rate Limit] 429 Too Many Requests on ${endpoint}. Retry-After: ${retryAfter}s`);
      return {
        data: fallbackData,
        isLive: false,
        status: 429,
        isRateLimited: true,
        error: `Request limit reached. Please wait ${retryAfter} seconds before trying again.`,
      };
    }

    if (res.ok) {
      const json = await res.json();
      return { data: json as T, isLive: true, status: res.status };
    }

    return {
      data: fallbackData,
      isLive: false,
      status: res.status,
      error: `HTTP ${res.status}`,
    };
  } catch (err: unknown) {
    return {
      data: fallbackData,
      isLive: false,
      error: err instanceof Error ? err.message : 'Network error or service unreachable',
    };
  }
}

/**
 * Standard apiClient function for ad-hoc or standard fetch requests
 */
export const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getCsrfHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders(),
          ...(options.headers || {}),
        },
      });
    }
  }

  return response;
};
