import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import { sanitizeSlug, tenantPortalUrls } from '@/lib/tenantUrls';

function formatSchoolRow(row: Record<string, unknown>) {
  let activeModules: Record<string, boolean> = {};
  if (typeof row.active_modules === 'string') {
    try {
      activeModules = JSON.parse(row.active_modules);
    } catch {
      activeModules = {};
    }
  } else if (typeof row.active_modules === 'object' && row.active_modules !== null) {
    activeModules = row.active_modules as Record<string, boolean>;
  }

  const slug = String(row.subdomain_slug || '');
  const urls = tenantPortalUrls(slug);

  return {
    id: String(row.id || `sch-${slug}`),
    creator_phone: String(row.creator_phone || ''),
    creator_name: String(row.creator_name || ''),
    leadership_position: String(row.leadership_position || ''),
    school_name: String(row.school_name || ''),
    teacher_count: String(row.teacher_count || '50'),
    affiliation_board: String(row.affiliation_board || 'CBSE'),
    enrolled_scholars: String(row.enrolled_scholars || '1,000'),
    city: String(row.city || ''),
    state_territory: String(row.state_territory || ''),
    subdomain_slug: slug,
    school_motto: String(row.school_motto || ''),
    active_modules: activeModules,
    student_domain: String(row.student_domain || urls.customDomain),
    admin_domain: String(row.admin_domain || urls.customAdminDomain),
    vercel_fallback_domain: String(row.vercel_fallback_domain || urls.appDomain),
    provisioning_status: String(row.provisioning_status || 'active'),
    theme_color: String(row.theme_color || '#0A192F'),
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = sanitizeSlug(slug);

    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM schools WHERE subdomain_slug = ? LIMIT 1',
      args: [cleanSlug],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const school = formatSchoolRow(result.rows[0] as unknown as Record<string, unknown>);
    return NextResponse.json(school);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = sanitizeSlug(slug);

    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const body = await request.json();
    const modules = body.active_modules || body.enabled_modules || {};
    const modulesJson = JSON.stringify(modules);
    const now = new Date().toISOString();

    await turso.execute({
      sql: 'UPDATE schools SET active_modules = ?, updated_at = ? WHERE subdomain_slug = ?',
      args: [modulesJson, now, cleanSlug],
    });

    const result = await turso.execute({
      sql: 'SELECT * FROM schools WHERE subdomain_slug = ? LIMIT 1',
      args: [cleanSlug],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const school = formatSchoolRow(result.rows[0] as unknown as Record<string, unknown>);
    return NextResponse.json(school);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
