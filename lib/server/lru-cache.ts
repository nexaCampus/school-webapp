// NexaCampus Server In-Memory LRU Cache & SingleFlight Stampede Guard
// Mirrors backend-school-go TinyLFU / Ristretto cache engine (64MB / 50MB ceiling)

import { LRUCache } from 'lru-cache';

// Global memory-bounded LRU cache instance
const memoryCache = new LRUCache<string, any>({
  max: 500, // Maximum items in memory
  maxSize: 50 * 1024 * 1024, // 50 MB hard memory ceiling
  sizeCalculation: (value) => {
    try {
      return typeof value === 'string' ? value.length : JSON.stringify(value).length;
    } catch {
      return 1024;
    }
  },
  ttl: 5 * 60 * 1000, // Default 5 minutes
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

// SingleFlight map: coalesces concurrent requests for identical keys to a single execution
const inflightRequests = new Map<string, Promise<unknown>>();

/**
 * Returns cached item if fresh; otherwise executes computeFn using SingleFlight deduplication
 */
export async function getOrCompute<T>(
  key: string,
  ttlMs: number,
  computeFn: () => Promise<T>
): Promise<T> {
  // 1. L1 Cache Hit (<1ms)
  const cached = memoryCache.get(key);
  if (cached !== undefined) {
    return cached as T;
  }

  // 2. SingleFlight Guard: coalesces duplicate concurrent queries
  const existingPromise = inflightRequests.get(key);
  if (existingPromise) {
    return existingPromise as Promise<T>;
  }

  const promise = (async () => {
    try {
      const result = await computeFn();
      if (result !== undefined && result !== null) {
        memoryCache.set(key, result, { ttl: ttlMs });
      }
      return result;
    } finally {
      inflightRequests.delete(key);
    }
  })();

  inflightRequests.set(key, promise);
  return promise as Promise<T>;
}

/**
 * Invalidates all cache entries starting with a specific prefix
 */
export function invalidateCachePrefix(prefix: string): number {
  let count = 0;
  for (const key of Array.from(memoryCache.keys())) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
      count++;
    }
  }
  return count;
}

/**
 * Invalidates a specific cache key
 */
export function invalidateCacheKey(key: string): boolean {
  return memoryCache.delete(key);
}

/**
 * Completely clears in-memory cache
 */
export function clearCache(): void {
  memoryCache.clear();
  inflightRequests.clear();
}

/**
 * Returns cache telemetry & diagnostics
 */
export function getCacheStats() {
  return {
    size: memoryCache.size,
    calculatedSize: memoryCache.calculatedSize,
    maxSize: memoryCache.maxSize,
    inflightCount: inflightRequests.size,
  };
}
