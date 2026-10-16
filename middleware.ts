import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NexaCampus Multi-Tenant Edge Route Guard & Subdomain Resolver
 * Intercepts requests at the edge before HTML rendering:
 * 1. Resolves tenant slug from Host header (<slug>.nexacampus.tech, <slug>.admin.nexacampus.tech, <slug>-nexacampus.vercel.app)
 * 2. Handles path-based fallback routing (/s/:slug and /s/:slug/admin) for instant testing
 * 3. Injects x-school-slug and x-portal-role headers and school_tenant_slug cookie
 * 4. Protects non-public routes with HttpOnly session token checks
 */

const RESERVED_SLUGS = new Set([
  'www',
  'admin',
  'api',
  'app',
  'maker',
  'platform',
  'status',
  'mail',
  'assets',
  'school-webapp-self',
]);

interface TenantResolution {
  slug: string | null;
  role: 'student' | 'admin';
  isAdminHost: boolean;
}

function resolveTenantFromHost(host: string): TenantResolution {
  // Strip port if present
  const cleanHost = host.split(':')[0].toLowerCase();

  // 1. Admin custom domain: <slug>.admin.nexacampus.tech (or .com)
  const adminCustomMatch = cleanHost.match(/^([a-z0-9-]+)\.admin\.nexacampus\.(?:tech|com)$/);
  if (adminCustomMatch && !RESERVED_SLUGS.has(adminCustomMatch[1])) {
    return { slug: adminCustomMatch[1], role: 'admin', isAdminHost: true };
  }

  // 2. Admin Vercel alias: <slug>-admin-nexacampus.vercel.app
  const adminVercelMatch = cleanHost.match(/^([a-z0-9-]+)-admin-nexacampus\.vercel\.app$/);
  if (adminVercelMatch && !RESERVED_SLUGS.has(adminVercelMatch[1])) {
    return { slug: adminVercelMatch[1], role: 'admin', isAdminHost: true };
  }

  // 3. Localhost Admin: <slug>.admin.localhost
  const adminLocalMatch = cleanHost.match(/^([a-z0-9-]+)\.admin\.localhost$/);
  if (adminLocalMatch && !RESERVED_SLUGS.has(adminLocalMatch[1])) {
    return { slug: adminLocalMatch[1], role: 'admin', isAdminHost: true };
  }

  // 4. Student/Public custom domain: <slug>.nexacampus.tech (or .com)
  const studentCustomMatch = cleanHost.match(/^([a-z0-9-]+)\.nexacampus\.(?:tech|com)$/);
  if (studentCustomMatch && !RESERVED_SLUGS.has(studentCustomMatch[1])) {
    return { slug: studentCustomMatch[1], role: 'student', isAdminHost: false };
  }

  // 5. Student/Public Vercel alias: <slug>-nexacampus.vercel.app
  const studentVercelMatch = cleanHost.match(/^([a-z0-9-]+)-nexacampus\.vercel\.app$/);
  if (studentVercelMatch && !RESERVED_SLUGS.has(studentVercelMatch[1])) {
    return { slug: studentVercelMatch[1], role: 'student', isAdminHost: false };
  }

  // 6. Localhost Student: <slug>.localhost
  const studentLocalMatch = cleanHost.match(/^([a-z0-9-]+)\.localhost$/);
  if (studentLocalMatch && !RESERVED_SLUGS.has(studentLocalMatch[1])) {
    return { slug: studentLocalMatch[1], role: 'student', isAdminHost: false };
  }

  return { slug: null, role: 'student', isAdminHost: false };
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || '';

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

  // 2. Resolve Tenant from Host, Path Fallback, or Query Params
  let tenantResolution = resolveTenantFromHost(host);
  let rewriteUrl: URL | null = null;
  let effectiveSlug = tenantResolution.slug;
  let effectiveRole = tenantResolution.role;

  // Handle path fallback: /school/:slug (and legacy alias /s/:slug)
  if (pathname.startsWith('/school/') || pathname.startsWith('/s/')) {
    const segments = pathname.split('/').filter(Boolean); // ['school', slug, ...] or ['s', slug, ...]
    if (segments.length >= 2) {
      const pathSlug = segments[1].toLowerCase();
      effectiveSlug = pathSlug;

      const subSegments = segments.slice(2); // e.g. ['admin'], ['canteen'], or []
      let targetPath = '/' + subSegments.join('/');
      if (targetPath === '/' || targetPath === '') {
        targetPath = '/';
      }

      if (subSegments[0] === 'admin') {
        effectiveRole = 'admin';
      }

      rewriteUrl = new URL(targetPath, request.url);
      rewriteUrl.searchParams.set('tenant', pathSlug);
      // Copy other existing search params
      searchParams.forEach((val, key) => {
        if (key !== 'tenant') rewriteUrl?.searchParams.set(key, val);
      });
    }
  }

  // Check query param override (?tenant=... or ?school=...)
  const queryTenant = searchParams.get('tenant') || searchParams.get('school');
  if (!effectiveSlug && queryTenant) {
    effectiveSlug = queryTenant.toLowerCase();
  }

  // If on admin subdomain and accessing root '/', rewrite to '/admin'
  if (tenantResolution.isAdminHost && pathname === '/' && !rewriteUrl) {
    rewriteUrl = new URL('/admin', request.url);
    if (effectiveSlug) {
      rewriteUrl.searchParams.set('tenant', effectiveSlug);
    }
  }

  // Prepare request headers to pass along
  const requestHeaders = new Headers(request.headers);
  if (effectiveSlug) {
    requestHeaders.set('x-school-slug', effectiveSlug);
  }
  requestHeaders.set('x-portal-role', effectiveRole);

  // 3. Whitelisted public paths (splash, auth entry, registration, statutory policies, maker & public directory)
  const publicPaths = [
    '/',
    '/chooser',
    '/email',
    '/admission',
    '/onboarding',
    '/privacy',
    '/terms',
    '/refund',
    '/cookies',
    '/data-deletion',
    '/maker',
    '/explore',
    '/apply',
    '/disclosures',
    '/facilities',
    '/faculty',
    '/admin', // admin login view handles its own credential validation
  ];

  const targetPath = rewriteUrl ? rewriteUrl.pathname : pathname;
  const isPublicPath =
    targetPath === '/' ||
    targetPath.startsWith('/s/') ||
    publicPaths.some((p) => targetPath === p || targetPath.startsWith(p + '/'));

  // 4. Inspect HttpOnly auth cookie or session indicator cookie
  const authToken = request.cookies.get('school_auth_token')?.value;
  const sessionActive = request.cookies.get('school_session_active')?.value;
  const isAuthenticated = Boolean(authToken || sessionActive);

  let response: NextResponse;

  if (rewriteUrl) {
    response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Attach tenant slug cookie for effortless client hydration
  if (effectiveSlug) {
    response.cookies.set('school_tenant_slug', effectiveSlug, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // accessible to client scripts
    });
  }

  if (isPublicPath) {
    return response;
  }

  // 5. Redirect unauthenticated requests to /chooser with redirect & tenant query params
  if (!isAuthenticated) {
    const loginUrl = new URL('/chooser', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    if (effectiveSlug) {
      loginUrl.searchParams.set('tenant', effectiveSlug);
    }
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, PWA files & images
     */
    '/((?!_next/static|_next/image|icons|fonts|models|sw\\.js|manifest\\.json|manifest\\.webmanifest|favicon\\.ico|favicon\\.png|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2|woff|ttf|glb|gltf|js|css|json)$).*)',
  ],
};
