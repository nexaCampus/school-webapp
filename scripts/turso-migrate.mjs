import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://nexa-campus-parthasdey2304.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTI3NDQxMDQsImlkIjoiMDFhMTQ0NzEtOWIwMS03MTM3LThhMjEtYWZjYjU5YzM4Y2NiIiwia2lkIjoiNm01MU5ocWZzWFgxUWFyQlFVcHZ1eGhvTmxZcEhyYXA0VXU4STdsaTFWRSIsInJpZCI6IjdiZDJlZWM3LWNjODctNDA4Mi1hMWRmLTNmODBiZDFiZTI3MSJ9.78XD4RBXwhjx0Hr2AjHVDLMzqGGDGOKwy1ZtunXvFLzU0aM64c2UOc1S1vcHVHy6k5PtVinCms5HYp67l5DlAg'
});

async function migrate() {
  console.log('Running Turso SQLite relational migrations...');

  // 1. School Subdomains relational table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS school_subdomains (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      subdomain_slug TEXT NOT NULL,
      domain_type TEXT NOT NULL,
      full_domain TEXT NOT NULL,
      target_cname TEXT NOT NULL DEFAULT 'cname.vercel-dns.com',
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL,
      FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_subdomains_slug ON school_subdomains(subdomain_slug);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_subdomains_school_id ON school_subdomains(school_id);`);

  // 2. School Modules normalized table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS school_modules (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      module_key TEXT NOT NULL,
      is_enabled INTEGER NOT NULL DEFAULT 1,
      updated_at DATETIME NOT NULL,
      UNIQUE(school_id, module_key),
      FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_school_modules_school ON school_modules(school_id);`);

  // 3. Maker Audit Logs
  await client.execute(`
    CREATE TABLE IF NOT EXISTS maker_audit_logs (
      id TEXT PRIMARY KEY,
      school_id TEXT,
      creator_phone TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME NOT NULL
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_audit_creator ON maker_audit_logs(creator_phone);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_audit_school ON maker_audit_logs(school_id);`);

  // 4. Ensure creator_sessions has attempts and channel columns
  const tableInfo = await client.execute(`PRAGMA table_info(creator_sessions);`);
  const columns = tableInfo.rows.map(r => r.name);
  if (!columns.includes('attempts')) {
    try {
      await client.execute(`ALTER TABLE creator_sessions ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;`);
    } catch {}
  }
  if (!columns.includes('channel')) {
    try {
      await client.execute(`ALTER TABLE creator_sessions ADD COLUMN channel TEXT DEFAULT 'whatsapp';`);
    } catch {}
  }

  // 5. Seed school_subdomains and school_modules from existing schools
  const schools = await client.execute(`SELECT id, subdomain_slug, student_domain, admin_domain, active_modules FROM schools;`);
  for (const row of schools.rows) {
    const schoolId = String(row.id);
    const slug = String(row.subdomain_slug);
    const now = new Date().toISOString();

    // Student subdomain
    await client.execute({
      sql: `INSERT OR REPLACE INTO school_subdomains (id, school_id, subdomain_slug, domain_type, full_domain, target_cname, status, created_at)
            VALUES (?, ?, ?, 'student', ?, 'cname.vercel-dns.com', 'active', ?)`,
      args: [`sub-${slug}-student`, schoolId, slug, String(row.student_domain || `https://${slug}.nexacampus.school`), now]
    });

    // Admin subdomain
    await client.execute({
      sql: `INSERT OR REPLACE INTO school_subdomains (id, school_id, subdomain_slug, domain_type, full_domain, target_cname, status, created_at)
            VALUES (?, ?, ?, 'admin', ?, 'cname.vercel-dns.com', 'active', ?)`,
      args: [`sub-${slug}-admin`, schoolId, slug, String(row.admin_domain || `https://${slug}.admin.nexacampus.school`), now]
    });

    // Populate school_modules
    if (row.active_modules) {
      try {
        const modules = JSON.parse(String(row.active_modules));
        for (const [modKey, isEnabled] of Object.entries(modules)) {
          await client.execute({
            sql: `INSERT OR REPLACE INTO school_modules (id, school_id, module_key, is_enabled, updated_at)
                  VALUES (?, ?, ?, ?, ?)`,
            args: [`mod-${slug}-${modKey}`, schoolId, modKey, isEnabled ? 1 : 0, now]
          });
        }
      } catch (err) {
        console.warn('Could not parse active_modules for', slug, err);
      }
    }
  }

  console.log('✓ Turso schema migration completed with all relational tables and indexes!');
}

migrate().catch(console.error);
