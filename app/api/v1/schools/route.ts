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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorPhone = searchParams.get('creator_phone');
    const query = searchParams.get('q');

    let result;
    if (creatorPhone) {
      result = await turso.execute({
        sql: 'SELECT * FROM schools WHERE creator_phone = ? ORDER BY created_at DESC',
        args: [creatorPhone.trim()],
      });
    } else if (query) {
      const pattern = `%${query.trim()}%`;
      result = await turso.execute({
        sql: 'SELECT * FROM schools WHERE school_name LIKE ? OR city LIKE ? OR subdomain_slug LIKE ? ORDER BY created_at DESC',
        args: [pattern, pattern, pattern],
      });
    } else {
      result = await turso.execute('SELECT * FROM schools ORDER BY created_at DESC');
    }

    const schools = result.rows.map((r) => formatSchoolRow(r as unknown as Record<string, unknown>));
    return NextResponse.json(schools);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cleanSlug = sanitizeSlug(body.subdomain || body.subdomain_slug);

    if (!cleanSlug) {
      return NextResponse.json(
        { error: 'Invalid subdomain slug. Use lowercase alphanumeric characters and hyphens.' },
        { status: 400 }
      );
    }

    const schoolId = `sch-${cleanSlug}`;
    const urls = tenantPortalUrls(cleanSlug);
    const now = new Date().toISOString();
    const modulesJson = JSON.stringify(body.enabled_modules || body.active_modules || {});

    // Insert or update schools in Turso
    await turso.execute({
      sql: `INSERT INTO schools (
        id, creator_phone, creator_name, leadership_position,
        school_name, teacher_count, affiliation_board, enrolled_scholars,
        city, state_territory, subdomain_slug, school_motto,
        active_modules, student_domain, admin_domain, vercel_fallback_domain,
        provisioning_status, theme_color, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        school_name = excluded.school_name,
        teacher_count = excluded.teacher_count,
        affiliation_board = excluded.affiliation_board,
        enrolled_scholars = excluded.enrolled_scholars,
        city = excluded.city,
        state_territory = excluded.state_territory,
        school_motto = excluded.school_motto,
        active_modules = excluded.active_modules,
        student_domain = excluded.student_domain,
        admin_domain = excluded.admin_domain,
        vercel_fallback_domain = excluded.vercel_fallback_domain,
        updated_at = excluded.updated_at`,
      args: [
        schoolId,
        body.creator_phone || body.creatorPhone || '',
        body.creator_name || body.creatorName || '',
        body.leadership_position || body.creatorPosition || 'Head of Institution',
        body.school_name || body.schoolName || `${cleanSlug.toUpperCase()} School`,
        String(body.teacher_count || body.teacherCount || '50'),
        body.affiliation_board || body.board || 'CBSE',
        String(body.enrolled_scholars || body.studentCapacity || '1,000'),
        body.city || 'Campus',
        body.state_territory || body.state || 'West Bengal',
        cleanSlug,
        body.school_motto || body.motto || 'Excellence in Education',
        modulesJson,
        urls.customDomain,
        urls.customAdminDomain,
        urls.appDomain,
        'active',
        body.theme_color || body.themeColor || '#0A192F',
        now,
        now,
      ],
    });

    return NextResponse.json({
      success: true,
      school_id: schoolId,
      subdomain_slug: cleanSlug,
      student_url: urls.customDomain,
      admin_url: urls.customAdminDomain,
      vercel_url: urls.appDomain,
      urls,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Provisioning error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
