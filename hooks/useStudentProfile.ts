'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/api/go-client';
import type { UpdateStudentRequest } from '@/lib/api/go-types';

export function useStudentProfile(studentId: string) {
  return useQuery({
    queryKey: queryKeys.student.profile(studentId),
    queryFn: async () => {
      return await goApi.getStudentData(studentId);
    },
    staleTime: CACHE_TTLS.STUDENT_PROFILE, // 5 minutes matching backend TTL
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateStudentRequest & { admissionId?: string }) => {
      return await goApi.updateStudentData(req);
    },
    onSuccess: (_, variables) => {
      // Invalidate student profile and dashboard queries
      if (variables.admissionId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.student.profile(variables.admissionId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
    },
  });
}
