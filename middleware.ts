import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth/sessionToken';
import { SHARED_COOKIE_DOMAIN } from '@/lib/tenantUrls';

/**
 * NexaCampus Multi-Tenant Edge Route Guard & Subdomain Resolver
 * Intercepts requests at the edge before HTML rendering:
 * 1. Resolves tenant slug from Host header (<slug>.nexacampus.tech, <slug>.admin.nexacampus.tech, <slug>.<APP_HOST>)
 * 2. Canonicalises path-based tenant URLs (/school/:slug, /s/:slug) into their subdomain form
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

/**
 * Canonical host that serves the webapp. Every tenant is addressed as
 * <slug>.<APP_HOST> (student) and <slug>.admin.<APP_HOST> (admin).
 * The legacy path form (/school/<slug>) is redirected to it.
 */
const APP_HOST = (process.env.NEXT_PUBLIC_CANONICAL_APP_HOST || 'nexacampus.school')
  .toLowerCase()
  .trim();

const APP_HOST_PATTERN = APP_HOST.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

interface TenantResolution {
  slug: string | null;
  role: 'student' | 'admin';
  isAdminHost: boolean;
}

function resolveTenantFromHost(host: string): TenantResolution {
  // Strip port if present
  const cleanHost = host.split(':')[0].toLowerCase();

  // 1. Admin custom domain: <slug>.admin.nexacampus.tech (or .com)
  const adminCustomMatch = cleanHost.match(/^([a-z0-9-]+)\.admin\.nexacampus\.(?:school|tech|com)$/);
  if (adminCustomMatch && !RESERVED_SLUGS.has(adminCustomMatch[1])) {
    return { slug: adminCustomMatch[1], role: 'admin', isAdminHost: true };
  }

  // 2. Admin app host: <slug>.admin.<APP_HOST>  (e.g. greenwood.admin.school-webapp-self.vercel.app)
  const adminAppHostMatch = cleanHost.match(
    new RegExp(`^([a-z0-9-]+)\\.admin\\.${APP_HOST_PATTERN}$`)
  );
  if (adminAppHostMatch && !RESERVED_SLUGS.has(adminAppHostMatch[1])) {
    return { slug: adminAppHostMatch[1], role: 'admin', isAdminHost: true };
  }

  // 3. Admin Vercel alias: <slug>-admin-nexacampus.vercel.app
  const adminVercelMatch = cleanHost.match(/^([a-z0-9-]+)-admin-nexacampus\.vercel\.app$/);
  if (adminVercelMatch && !RESERVED_SLUGS.has(adminVercelMatch[1])) {
    return { slug: adminVercelMatch[1], role: 'admin', isAdminHost: true };
  }

  // 4. Localhost Admin: <slug>.admin.localhost
  const adminLocalMatch = cleanHost.match(/^([a-z0-9-]+)\.admin\.localhost$/);
  if (adminLocalMatch && !RESERVED_SLUGS.has(adminLocalMatch[1])) {
    return { slug: adminLocalMatch[1], role: 'admin', isAdminHost: true };
  }

  // 5. Student/Public custom domain: <slug>.nexacampus.tech (or .com)
  const studentCustomMatch = cleanHost.match(/^([a-z0-9-]+)\.nexacampus\.(?:school|tech|com)$/);
  if (studentCustomMatch && !RESERVED_SLUGS.has(studentCustomMatch[1])) {
    return { slug: studentCustomMatch[1], role: 'student', isAdminHost: false };
  }

  // 6. Student app host: <slug>.<APP_HOST>  (e.g. greenwood.school-webapp-self.vercel.app)
  const studentAppHostMatch = cleanHost.match(
    new RegExp(`^([a-z0-9-]+)\\.${APP_HOST_PATTERN}$`)
  );
  if (studentAppHostMatch && !RESERVED_SLUGS.has(studentAppHostMatch[1])) {
    return { slug: studentAppHostMatch[1], role: 'student', isAdminHost: false };
  }

  // 7. Student/Public Vercel alias: <slug>-nexacampus.vercel.app
  const studentVercelMatch = cleanHost.match(/^([a-z0-9-]+)-nexacampus\.vercel\.app$/);
  if (studentVercelMatch && !RESERVED_SLUGS.has(studentVercelMatch[1])) {
    return { slug: studentVercelMatch[1], role: 'student', isAdminHost: false };
  }

  // 8. Localhost Student: <slug>.localhost
  const studentLocalMatch = cleanHost.match(/^([a-z0-9-]+)\.localhost$/);
  if (studentLocalMatch && !RESERVED_SLUGS.has(studentLocalMatch[1])) {
    return { slug: studentLocalMatch[1], role: 'student', isAdminHost: false };
  }

  return { slug: null, role: 'student', isAdminHost: false };
}

/**
 * Builds the canonical tenant URL for a slug.
 * Production -> https://<slug>.<APP_HOST> (admin: https://<slug>.admin.<APP_HOST>)
 * Local dev  -> http://<slug>.localhost:<port>
 */
function canonicalTenantUrl(
  request: NextRequest,
  slug: string,
  isAdmin: boolean,
  pathname: string,
  search: string
): URL {
  const host = (request.headers.get('host') || '').toLowerCase();
  const isLocal = host.endsWith('localhost') || host.startsWith('127.0.0.1') || host === '[::1]';

  if (isLocal) {
    const port = host.includes(':') ? host.split(':')[1] : '3000';
    const localHost = isAdmin ? `${slug}.admin.localhost:${port}` : `${slug}.localhost:${port}`;
    return new URL(`${pathname}${search}`, `http://${localHost}`);
  }

  const canonicalHost = isAdmin ? `${slug}.admin.${APP_HOST}` : `${slug}.${APP_HOST}`;
  return new URL(`${pathname}${search}`, `https://${canonicalHost}`);
}

export async function middleware(request: NextRequest) {
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

      const isAdminPath = subSegments[0] === 'admin';
      if (isAdminPath) {
        effectiveRole = 'admin';
      }

      // Canonical form: <slug>.<APP_HOST> (or <slug>.admin.<APP_HOST>).
      // Only skip the redirect when the request is already on the tenant host.
      if (tenantResolution.slug !== pathSlug) {
        const canonical = canonicalTenantUrl(
          request,
          pathSlug,
          isAdminPath,
          targetPath,
          request.nextUrl.search
        );
        return NextResponse.redirect(canonical, 308);
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
  // NOTE: /admin is intentionally NOT public — the admin console requires a signed
  // session cookie and performs its own credential check.
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
  ];

  const targetPath = rewriteUrl ? rewriteUrl.pathname : pathname;
  const isPublicPath =
    targetPath === '/' ||
    targetPath.startsWith('/s/') ||
    publicPaths.some((p) => targetPath === p || targetPath.startsWith(p + '/'));

  // 4. Verify the signed session cookie minted by /api/auth/session.
  //    A client-writable flag cookie is NOT trusted: it can be forged.
  const sessionSecret = (process.env.SESSION_SECRET || '').trim();
  const sessionPayload = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
    sessionSecret
  );
  const isAuthenticated = Boolean(sessionPayload);

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

  // Attach tenant slug cookie for effortless client hydration.
  // It is scoped to the shared parent domain so it survives the canonical
  // subdomain redirect (platform host -> <slug>.<app-host>).
  if (effectiveSlug) {
    response.cookies.set('school_tenant_slug', effectiveSlug, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // accessible to client scripts
      domain: SHARED_COOKIE_DOMAIN,
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

  // 6. The admin console is restricted to administrator / creator sessions.
  if (targetPath === '/admin' || targetPath.startsWith('/admin/')) {
    const role = sessionPayload?.role;
    if (role !== 'admin' && role !== 'creator') {
      const loginUrl = new URL('/chooser', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      if (effectiveSlug) {
        loginUrl.searchParams.set('tenant', effectiveSlug);
      }
      return NextResponse.redirect(loginUrl);
    }
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
