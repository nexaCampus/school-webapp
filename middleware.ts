import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NexaCampus Edge Route Guard (Point 13 - Client-side-only permission enforcement defense)
 * Intercepts requests at the edge before HTML rendering.
 * Inspects HttpOnly school_auth_token or school_session_active cookies.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static assets, service worker, manifests, fonts, and internal Next.js paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/models') ||
    pathname.startsWith('/api') ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2|woff|ttf|glb|gltf|js|css|json)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Whitelisted public paths (splash, auth entry, registration)
  const publicPaths = ['/chooser', '/email', '/admission', '/onboarding'];
  const isPublicPath =
    pathname === '/' ||
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));

  // 3. Inspect HttpOnly auth cookie or session indicator cookie
  const authToken = request.cookies.get('school_auth_token')?.value;
  const sessionActive = request.cookies.get('school_session_active')?.value;
  const isAuthenticated = Boolean(authToken || sessionActive);

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 4. Redirect unauthenticated requests to /chooser with redirect query param
  if (!isAuthenticated) {
    const loginUrl = new URL('/chooser', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, PWA files & images
     */
    '/((?!_next/static|_next/image|icons|fonts|models|sw\\.js|manifest\\.json|manifest\\.webmanifest|favicon\\.ico|favicon\\.png|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2|woff|ttf|glb|gltf|js|css|json)$).*)',
  ],
};
