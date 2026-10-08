// NexaCampus Client Query Cache Manager
// Configures TanStack Query L1 In-Memory Cache with SingleFlight coalescing and adaptive eviction

import { QueryClient } from '@tanstack/react-query';

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes default stale time
        gcTime: 10 * 60 * 1000,    // 10 minutes memory retention before garbage collection
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a singleton QueryClient on the browser or a fresh one per SSR request
 */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return makeQueryClient();
  }
  // Browser: keep singleton query client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export const queryClient = getQueryClient();
