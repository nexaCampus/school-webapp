import { NextRequest, NextResponse } from 'next/server';

const GO_BACKEND_URL = process.env.GO_BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

async function proxyRequest(request: NextRequest, slug: string[]) {
  const path = slug.join('/');
  const search = request.nextUrl.search;
  const targetUrl = `${GO_BACKEND_URL}/api/v1/${path}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Avoid forwarding host header
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value);
    }
  });

  try {
    const body = ['POST', 'PUT', 'PATCH'].includes(request.method) ? await request.text() : undefined;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const goResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await goResponse.text();
    return new NextResponse(data, {
      status: goResponse.status,
      headers: {
        'Content-Type': goResponse.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (err: unknown) {
    // Graceful proxy response when Go server is not yet running
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
