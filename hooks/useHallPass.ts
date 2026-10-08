'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/goApiClient';

export function useHallPass(studentId = 'active') {
  return useQuery({
    queryKey: queryKeys.hallpass.active(studentId),
    queryFn: async () => {
      return await goApi.getHallPass();
    },
    staleTime: CACHE_TTLS.HALLPASS_ACTIVE, // 15 seconds matching backend TTL
  });
}
