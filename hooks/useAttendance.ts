'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/api/go-client';
import type { CreateLeaveRequestPayload } from '@/lib/api/go-types';

export function useAttendance() {
  return useQuery({
    queryKey: queryKeys.attendance.summary('active'),
    queryFn: async () => {
      return await goApi.getAttendance();
    },
    staleTime: CACHE_TTLS.ATTENDANCE_SUMMARY, // 2 minutes matching backend TTL
  });
}

export function useLeaveHistory() {
  return useQuery({
    queryKey: queryKeys.attendance.leaves('active'),
    queryFn: async () => {
      return await goApi.getLeaveRequest();
    },
    staleTime: CACHE_TTLS.ATTENDANCE_LEAVES, // 2 minutes matching backend TTL
  });
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateLeaveRequestPayload) => {
      return await goApi.postLeaveRequest(req);
    },
    onSuccess: () => {
      // 1. Invalidate attendance summary and leave lists
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });

      // 2. Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
    },
  });
}
