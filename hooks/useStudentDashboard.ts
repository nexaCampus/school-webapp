'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/goApiClient';

export function useStudentDashboard(studentId: string, grade = '12', section = 'E') {
  return useQuery({
    queryKey: queryKeys.student.dashboard(studentId, grade, section),
    queryFn: async () => {
      return await goApi.getStudentData(studentId);
    },
    staleTime: CACHE_TTLS.STUDENT_DASHBOARD, // 2 minutes matching backend TTL
  });
}
