import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import { sanitizeSlug, tenantPortalUrls } from '@/lib/tenantUrls';

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
  'dashboard',
  'billing',
  'auth',
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSlug = searchParams.get('slug') || '';
    const cleanSlug = sanitizeSlug(rawSlug);

    const urls = tenantPortalUrls(cleanSlug || 'example');

    if (!cleanSlug || cleanSlug.length < 2) {
      return NextResponse.json({
        valid: false,
        available: false,
        slug: rawSlug,
        reason: 'Slug must be at least 2 characters (alphanumeric and hyphens only).',
        urls: {
          student_custom: urls.customDomain,
          admin_custom: urls.customAdminDomain,
          vercel_fallback: urls.appDomain,
          path_fallback: urls.pathFallback,
        },
      });
    }

    if (RESERVED_SLUGS.has(cleanSlug)) {
      return NextResponse.json({
        valid: false,
        available: false,
        slug: cleanSlug,
        reason: `'${cleanSlug}' is a reserved NexaCampus system domain.`,
        urls: {
          student_custom: urls.customDomain,
          admin_custom: urls.customAdminDomain,
          vercel_fallback: urls.appDomain,
          path_fallback: urls.pathFallback,
        },
      });
    }

    const result = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM schools WHERE subdomain_slug = ?',
      args: [cleanSlug],
    });

    const count = Number(result.rows[0]?.[0] || 0);

    if (count > 0) {
      return NextResponse.json({
        valid: true,
        available: false,
        slug: cleanSlug,
        reason: `Subdomain '${cleanSlug}' is already registered to an institution.`,
        urls: {
          student_custom: urls.customDomain,
          admin_custom: urls.customAdminDomain,
          vercel_fallback: urls.appDomain,
          path_fallback: urls.pathFallback,
        },
      });
    }

    return NextResponse.json({
      valid: true,
      available: true,
      slug: cleanSlug,
      reason: undefined,
      urls: {
        student_custom: urls.customDomain,
        admin_custom: urls.customAdminDomain,
        vercel_fallback: urls.appDomain,
        path_fallback: urls.pathFallback,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Check slug error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
