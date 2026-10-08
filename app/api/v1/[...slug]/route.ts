import { NextRequest, NextResponse } from 'next/server';
import { getOrCompute, invalidateCachePrefix } from '@/lib/server/lru-cache';
import { CACHE_TTLS } from '@/lib/query-keys';

const GO_BACKEND_URL = process.env.GO_BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyGetRequest(request, slug);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyMutationRequest(request, slug);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyMutationRequest(request, slug);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyMutationRequest(request, slug);
}

function resolveTtlForPath(path: string): number {
  if (path.includes('hallPass')) return CACHE_TTLS.HALLPASS_ACTIVE;
  if (path.includes('canteenWallet')) return CACHE_TTLS.CANTEEN_WALLET;
  if (path.includes('busTravel')) return CACHE_TTLS.TRANSPORT_GPS;
  if (path.includes('attendance') || path.includes('leaveRequest')) return CACHE_TTLS.ATTENDANCE_MONTHLY;
  if (path.includes('homework') || path.includes('dairy')) return CACHE_TTLS.HOMEWORK_LIST;
  if (path.includes('studentData')) return CACHE_TTLS.STUDENT_PROFILE;
  if (path.includes('notices')) return CACHE_TTLS.NOTICES_LIST;
  if (path.includes('fees') || path.includes('payment')) return CACHE_TTLS.FEES_SUMMARY;
  if (path.includes('library')) return CACHE_TTLS.LIBRARY_BOOKS;
  if (path.includes('timeTable')) return CACHE_TTLS.TIMETABLE;
  if (path.includes('exam') || path.includes('results')) return CACHE_TTLS.EXAMS_HALLTICKET;
  if (path.includes('photoGallery')) return CACHE_TTLS.GALLERY_ALBUMS;
  return 2 * 60 * 1000; // 2 min default
}

function invalidateForPath(path: string): void {
  const root = path.split('/')[0].toLowerCase();
  invalidateCachePrefix(`proxy:${root}`);

  if (root.includes('homework') || root.includes('dairy')) {
    invalidateCachePrefix('proxy:homework');
    invalidateCachePrefix('proxy:dairy');
    invalidateCachePrefix('proxy:studentdata');
  } else if (root.includes('leave') || root.includes('attendance')) {
    invalidateCachePrefix('proxy:attendance');
    invalidateCachePrefix('proxy:leaverequest');
  } else if (root.includes('payment') || root.includes('fees')) {
    invalidateCachePrefix('proxy:fees');
    invalidateCachePrefix('proxy:payment');
  } else if (root.includes('canteen') || root.includes('store')) {
    invalidateCachePrefix('proxy:canteen');
    invalidateCachePrefix('proxy:schoolstore');
  } else if (root.includes('student')) {
    invalidateCachePrefix('proxy:studentdata');
  }
}

async function proxyGetRequest(request: NextRequest, slug: string[]) {
  const path = slug.join('/');
  const search = request.nextUrl.search;
  const cacheKey = `proxy:${path.toLowerCase()}${search.toLowerCase()}`;
  const ttl = resolveTtlForPath(path);

  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host') {
      forwardHeaders.set(key, value);
    }
  });

  const targetUrl = `${GO_BACKEND_URL}/api/v1/${path}${search}`;

  try {
    const cachedResult = await getOrCompute(cacheKey, ttl, async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const goResponse = await fetch(targetUrl, {
        method: 'GET',
        headers: forwardHeaders,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await goResponse.text();
      return {
        data,
        status: goResponse.status,
        contentType: goResponse.headers.get('Content-Type') || 'application/json',
      };
    });

    return new NextResponse(cachedResult.data, {
      status: cachedResult.status,
      headers: {
        'Content-Type': cachedResult.contentType,
        'X-Cache': 'HIT',
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: 'OFFLINE_FALLBACK',
        message: 'Go backend server unreachable. Client fallback active.',
        path: `/api/v1/${path}`,
      },
      { status: 503 }
    );
  }
}

async function proxyMutationRequest(request: NextRequest, slug: string[]) {
  const path = slug.join('/');
  const search = request.nextUrl.search;
  const targetUrl = `${GO_BACKEND_URL}/api/v1/${path}${search}`;

  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host') {
      forwardHeaders.set(key, value);
    }
  });

  try {
    const body = ['POST', 'PUT', 'PATCH'].includes(request.method) ? await request.text() : undefined;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const goResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Mutation succeeded: invalidate corresponding cache keys
    if (goResponse.ok) {
      invalidateForPath(path);
    }

    const data = await goResponse.text();
    return new NextResponse(data, {
      status: goResponse.status,
      headers: {
        'Content-Type': goResponse.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: 'OFFLINE_FALLBACK',
        message: 'Go backend server unreachable. Client fallback active.',
        path: `/api/v1/${path}`,
      },
      { status: 503 }
    );
  }
}
