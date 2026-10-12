/**
 * NexaCampus Centralized Error Architecture
 *
 * Provides typed, hierarchical application error classes with error codes,
 * HTTP status mapping, user-friendly messages, and structured context.
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export interface ErrorDetails {
  code: string;
  statusCode?: number;
  fieldErrors?: Record<string, string>;
  severity?: ErrorSeverity;
  context?: Record<string, unknown>;
  originalError?: unknown;
}

/**
 * Base Application Error
 */
export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly fieldErrors?: Record<string, string>;
  readonly severity: ErrorSeverity;
  readonly context?: Record<string, unknown>;
  readonly timestamp: number;

  constructor(message: string, details: ErrorDetails = { code: 'APP_ERROR' }) {
    super(message);
    this.name = 'AppError';
    this.code = details.code;
    this.statusCode = details.statusCode ?? 500;
    this.fieldErrors = details.fieldErrors;
    this.severity = details.severity ?? 'error';
    this.context = details.context;
    this.timestamp = Date.now();

    // Preserve native stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      fieldErrors: this.fieldErrors,
      severity: this.severity,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Network and connectivity failures
 */
export class NetworkError extends AppError {
  constructor(message = 'Network connection failed. Please check your internet connectivity.', details?: Partial<ErrorDetails>) {
    super(message, {
      code: 'NETWORK_ERROR',
      statusCode: 0,
      severity: 'warning',
      ...details,
    });
    this.name = 'NetworkError';
  }
}

/**
 * Authentication failures (unauthenticated, expired token)
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Your session has expired or is invalid. Please sign in again.', details?: Partial<ErrorDetails>) {
    super(message, {
      code: 'AUTH_UNAUTHORIZED',
      statusCode: 401,
      severity: 'warning',
      ...details,
    });
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization & Permission failures (IDOR detection, insufficient role)
 */
export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to access or modify this record.', details?: Partial<ErrorDetails>) {
    super(message, {
      code: 'AUTH_FORBIDDEN',
      statusCode: 403,
      severity: 'error',
      ...details,
    });
    this.name = 'AuthorizationError';
  }
}

/**
 * Rate limit / Throttling errors
 */
export class RateLimitError extends AppError {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds = 60, message?: string, details?: Partial<ErrorDetails>) {
    super(
      message || `Too many requests. Please wait ${retryAfterSeconds} seconds before trying again.`,
      {
        code: 'RATE_LIMIT_EXCEEDED',
        statusCode: 429,
        severity: 'warning',
        ...details,
      }
    );
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Validation & user input errors
 */
export class ValidationError extends AppError {
  constructor(message = 'Please correct the invalid fields and try again.', fieldErrors?: Record<string, string>, details?: Partial<ErrorDetails>) {
    super(message, {
      code: 'VALIDATION_FAILED',
      statusCode: 422,
      fieldErrors,
      severity: 'warning',
      ...details,
    });
    this.name = 'ValidationError';
  }
}

/**
 * Not Found errors
 */
export class NotFoundError extends AppError {
  constructor(resourceName = 'Record', details?: Partial<ErrorDetails>) {
    super(`${resourceName} was not found on the live roster.`, {
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404,
      severity: 'info',
      ...details,
    });
    this.name = 'NotFoundError';
  }
}

/**
 * Safely converts any unknown caught exception into a structured AppError
 */
export function toAppError(error: unknown, fallbackMessage = 'An unexpected error occurred'): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return new NetworkError('The request timed out. Please try again.');
    }
    return new AppError(error.message || fallbackMessage, {
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      originalError: error,
    });
  }

  if (typeof error === 'string') {
    return new AppError(error, { code: 'STRING_ERROR', statusCode: 500 });
  }

  return new AppError(fallbackMessage, {
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    originalError: error,
  });
}
