/**
 * Backwards Compatibility Facade for apiClient
 * Directs all calls to the hardened, scalable lib/api module.
 */

export * from './api/client';
export * from './api/types';
export type { ApiResponse as ApiClientResponse } from './api/types';
export { default } from './api/client';
