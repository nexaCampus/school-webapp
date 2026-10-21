/**
 * NexaCampus Resilient HTTP Client
 *
 * Implements:
 * - Silent HttpOnly cookie token rotation on 401 Unauthorized
 * - CSRF defense-in-depth header injection
 * - IDOR & Permission violation interception (403)
 * - Rate limit detection & backoff guidance (429)
 * - Transient error retry with exponential backoff
 * - Typed response envelope & error translation to AppError
 */

import { apiEnv } from '../config/env';
import { getCsrfHeaders } from '../security';
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  RateLimitError,
  toAppError,
} from '../errors/AppError';
import type { ApiResponse, ApiRequestOptions } from './types';

const API_BASE_URL = apiEnv.apiBaseUrl;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

function generateRequestId(): string {
  const rand = Math.random().toString(36).substring(2, 9);
  return `req-${Date.now()}-${rand}`;
}

/**
 * Dispatches silent token rotation to renew the HttpOnly session cookie.
 */
async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
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
 * Core hardened fetch wrapper for all server communications.
 */
export async function secureFetch<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
  fallbackData: T,
  retryCount = 0
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const correlationId = options.correlationId || generateRequestId();
  const timeoutMs = options.timeoutMs ?? 5000;
  const maxRetries = options.maxRetries ?? 1;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': correlationId,
      ...(options.skipCsrf ? {} : getCsrfHeaders()),
      ...(options.headers as Record<string, string> | undefined),
    };

    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    // 1. Silent token refresh on 401 Unauthorized
    if (res.status === 401 && retryCount === 0) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        return secureFetch(endpoint, options, fallbackData, retryCount + 1);
      }
      return {
        data: fallbackData,
        isLive: false,
        status: 401,
        correlationId,
        error: new AuthenticationError().message,
      };
    }

    // 2. 403 Forbidden - IDOR or Permission Violation
    if (res.status === 403) {
      console.warn(`[Security Alert] 403 Forbidden on ${endpoint} [${correlationId}]`);
      return {
        data: fallbackData,
        isLive: false,
        status: 403,
        isForbidden: true,
        correlationId,
        error: new AuthorizationError().message,
      };
    }

    // 3. 429 Too Many Requests - Rate Limit Exceeded
    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '60', 10);
      console.warn(`[Rate Limit] 429 Too Many Requests on ${endpoint}. Retry-After: ${retryAfter}s`);
      return {
        data: fallbackData,
        isLive: false,
        status: 429,
        isRateLimited: true,
        correlationId,
        error: new RateLimitError(retryAfter).message,
      };
    }

    // 4. Transient Server Errors (502, 503, 504) Retry
    if ([502, 503, 504].includes(res.status) && retryCount < maxRetries && (!options.method || options.method === 'GET')) {
      const delay = (options.retryDelayMs ?? 400) * Math.pow(2, retryCount);
      await new Promise((r) => setTimeout(r, delay));
      return secureFetch(endpoint, options, fallbackData, retryCount + 1);
    }

    if (res.ok) {
      const json = await res.json();
      return {
        data: json as T,
        isLive: true,
        status: res.status,
        correlationId,
      };
    }

    return {
      data: fallbackData,
      isLive: false,
      status: res.status,
      correlationId,
      error: `HTTP ${res.status}: ${res.statusText}`,
    };
  } catch (err: unknown) {
    const appErr = toAppError(err);
    return {
      data: fallbackData,
      isLive: false,
      correlationId,
      error: appErr.message,
    };
  }
}

/**
 * Standard fetch utility for ad-hoc requests
 */
export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
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
      return fetch(url, {
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
}

export const api = {
  get: <T>(endpoint: string, fallback: T, options?: ApiRequestOptions) =>
    secureFetch<T>(endpoint, { method: 'GET', ...options }, fallback),

  post: <T>(endpoint: string, body?: unknown, fallback?: T, options?: ApiRequestOptions) =>
    secureFetch<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      },
      fallback as T
    ),

  put: <T>(endpoint: string, body?: unknown, fallback?: T, options?: ApiRequestOptions) =>
    secureFetch<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      },
      fallback as T
    ),

  delete: <T>(endpoint: string, fallback?: T, options?: ApiRequestOptions) =>
    secureFetch<T>(endpoint, { method: 'DELETE', ...options }, fallback as T),
};

export default api;
