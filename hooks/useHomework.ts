'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/api/go-client';
import type { SubmitHomeworkRequest } from '@/lib/api/go-types';

export function useHomeworkList(grade = '12', section = 'E', status = 'all') {
  return useQuery({
    queryKey: queryKeys.homework.list(grade, section, status),
    queryFn: async () => {
      return await goApi.getHomework();
    },
    staleTime: CACHE_TTLS.HOMEWORK_LIST, // 3 minutes matching backend TTL
  });
}

export function useSubmitHomework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: SubmitHomeworkRequest) => {
      return await goApi.submitHomework(req);
    },
    onSuccess: () => {
      // 1. Invalidate homework list queries across all filters
      queryClient.invalidateQueries({ queryKey: queryKeys.homework.all });

      // 2. Invalidate student dashboard queries (pending tasks count changed)
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
    },
  });
}
