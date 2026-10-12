/**
 * Standard API Envelopes and Request Types
 */

export interface ApiResponse<T> {
  data: T;
  isLive: boolean;
  status?: number;
  error?: string;
  isRateLimited?: boolean;
  isForbidden?: boolean;
  correlationId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  skipCsrf?: boolean;
  correlationId?: string;
}
