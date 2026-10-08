// NexaCampus Layer 2 Data Cache: React cache() Request Deduplication & Next.js Tag Invalidation
// Prevents duplicate fetches across server component trees and synchronizes server action updates

import { cache } from 'react';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const API_BASE_URL =
  process.env.GO_BACKEND_URL ||
  process.env.NEXT_PUBLIC_GO_API_URL ||
  'https://backend-school-go.onrender.com';

/**
 * Deduplicated Server Component fetch for Student Profile (5-minute TTL)
 */
export const getStudentProfileServer = cache(async (studentId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('school_auth_token')?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/studentData?admissionId=${studentId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // 5 minutes (matches backend TTL)
        tags: [`student-${studentId}`],
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
});

/**
 * Deduplicated Server Component fetch for Timetable (15-minute TTL)
 */
export const getTimeTableServer = cache(async (grade = '12', section = 'E') => {
  const cookieStore = await cookies();
  const token = cookieStore.get('school_auth_token')?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/timeTable?classGrade=${grade}&section=${section}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 900, // 15 minutes (matches backend TTL)
        tags: [`timetable-${grade}-${section}`],
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
});

/**
 * Invalidation helper for Server Actions
 */
export async function invalidateServerTag(tag: string): Promise<void> {
  revalidateTag(tag);
}
