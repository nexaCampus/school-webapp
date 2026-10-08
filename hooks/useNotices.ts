'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/goApiClient';

export function useNotices(category = 'all', limit = 20) {
  return useQuery({
    queryKey: queryKeys.notices.list(category, limit),
    queryFn: async () => {
      return await goApi.getNotices();
    },
    staleTime: CACHE_TTLS.NOTICES_LIST, // 5 minutes matching backend TTL
  });
}
