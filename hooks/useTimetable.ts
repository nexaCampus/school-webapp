'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/goApiClient';

export function useTimetable(grade = '12', section = 'E', day = 'Monday') {
  return useQuery({
    queryKey: queryKeys.timetable.schedule(grade, section, day),
    queryFn: async () => {
      return await goApi.getTimeTable(grade, section);
    },
    staleTime: CACHE_TTLS.TIMETABLE, // 15 minutes matching backend TTL
  });
}

export function useLabTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.lab(),
    queryFn: async () => {
      return await goApi.getLabTimeTable();
    },
    staleTime: CACHE_TTLS.TIMETABLE, // 15 minutes matching backend TTL
  });
}
