'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { fetchSchoolBySlug, updateSchoolModules, SchoolTenant } from '@/lib/api/makerClient';
import { SHARED_COOKIE_DOMAIN, sanitizeSlug } from '@/lib/tenantUrls';

export interface TenantContextType {
  tenant: SchoolTenant | null;
  slug: string | null;
  isPlatformRoot: boolean;
  loading: boolean;
  isModuleEnabled: (moduleId: string) => boolean;
  setTenantSlug: (newSlug: string | null) => void;
  reloadTenant: () => Promise<void>;
  updateModules: (modules: Record<string, boolean>) => Promise<boolean>;
}

// Canonical aliases to ensure short and long module keys both evaluate correctly
const MODULE_ALIASES: Record<string, string[]> = {
  canteen: ['canteen'],
  bus: ['bus', 'bus_transport', 'transport'],
  bus_transport: ['bus', 'bus_transport', 'transport'],
  library: ['library'],
  attendance: ['attendance'],
  diary: ['diary', 'homework_diary', 'homework'],
  homework_diary: ['diary', 'homework_diary', 'homework'],
  exams: ['exams', 'exams_reports', 'results'],
  exams_reports: ['exams', 'exams_reports', 'results'],
  timetable: ['timetable', 'timetable_bell'],
  timetable_bell: ['timetable', 'timetable_bell'],
  fees: ['fees', 'fee_ledger'],
  fee_ledger: ['fees', 'fee_ledger'],
  hallpass: ['hallpass', 'ehallpass'],
  ehallpass: ['hallpass', 'ehallpass'],
  clubs: ['clubs', 'clubs_houses'],
  clubs_houses: ['clubs', 'clubs_houses'],
  health: ['health', 'medical_infirmary', 'clinic'],
  clinic: ['health', 'medical_infirmary', 'clinic'],
  medical_infirmary: ['health', 'medical_infirmary', 'clinic'],
  notices: ['notices', 'circulars_notices', 'circulars'],
  circulars_notices: ['notices', 'circulars_notices', 'circulars'],
  ptm: ['ptm'],
  store: ['store', 'store_uniforms'],
  store_uniforms: ['store', 'store_uniforms'],
  lostfound: ['lostfound', 'lost_found'],
  lost_found: ['lostfound', 'lost_found'],
  merits: ['merits'],
  gallery: ['gallery'],
};

export const LCGVM_FLAGSHIP: SchoolTenant = {
  id: 'sch-flagship-lcgvm',
  subdomain_slug: 'lcgvm',
  school_name: 'Lions Calcutta Greater Vidya Mandir',
  school_motto: 'Knowledge is Power • CISCE Affiliated WB-243',
  leadership_position: 'Principal / Head of Institution',
  creator_name: 'NexaCampus Administrator',
  creator_phone: '+91 6289652321',
  teacher_count: '85',
  affiliation_board: 'CISCE',
  enrolled_scholars: '2400',
  city: 'Kolkata',
  state_territory: 'West Bengal',
  student_domain: 'https://lcgvm.nexacampus.tech',
  admin_domain: 'https://lcgvm.admin.nexacampus.tech',
  vercel_fallback_domain: 'https://lcgvm-nexacampus.vercel.app',
  provisioning_status: 'active',
  theme_color: '#0A192F',
  active_modules: {
    canteen: true,
    bus: true,
    bus_transport: true,
    library: true,
    attendance: true,
    diary: true,
    homework_diary: true,
    exams: true,
    exams_reports: true,
    timetable: true,
    timetable_bell: true,
    fees: true,
    fee_ledger: true,
    hallpass: true,
    ehallpass: true,
    clubs: true,
    clubs_houses: true,
    health: true,
    medical_infirmary: true,
    clinic: true,
    notices: true,
    circulars_notices: true,
    ptm: true,
    store: true,
    store_uniforms: true,
    lostfound: true,
    lost_found: true,
    merits: true,
    gallery: true,
  },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

/**
 * Scopes the tenant cookie to the shared parent domain so it survives the
 * canonical subdomain redirect (platform host -> <slug>.<app-host>).
 */
function sharedCookieDomainSuffix(): string {
  if (typeof window === 'undefined') return '';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  return `; domain=${SHARED_COOKIE_DOMAIN ?? ''}`;
}

function extractSlugFromWindow(currentPath?: string): string | null {
  if (typeof window === 'undefined') return null;

  const pathname = currentPath || window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const qSlug = params.get('tenant') || params.get('school');

  // If user is visiting /chooser without an explicit tenant query param,
  // they are on the universal campus selector: strictly PLATFORM ROOT!
  if ((pathname === '/chooser' || pathname.startsWith('/chooser/')) && !qSlug) {
    try {
      localStorage.removeItem('nexacampus_tenant_slug');
      document.cookie = `school_tenant_slug=; path=/; max-age=0; SameSite=Lax${sharedCookieDomainSuffix()}`;
    } catch {}
    return null;
  }

  // 1. Check URL query parameters (?tenant=... or ?school=...)
  if (qSlug && qSlug.trim()) {
    return qSlug.trim().toLowerCase();
  }

  // 2. Check path fallback (/school/:slug or legacy /s/:slug)
  if (pathname.startsWith('/school/') || pathname.startsWith('/s/')) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[1]) {
      return parts[1].toLowerCase();
    }
  }

  // 3. Check hostname subdomains
  const host = window.location.hostname.toLowerCase();
  const appHost = (
    process.env.NEXT_PUBLIC_CANONICAL_APP_HOST || 'school-webapp-self.vercel.app'
  )
    .toLowerCase()
    .trim();
  const appHostPattern = appHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reserved = ['www', 'admin', 'api', 'app', 'maker', 'platform'];

  // Localhost admin match: <slug>.admin.localhost
  const localAdminMatch = host.match(/^([a-z0-9-]+)\.admin\.localhost$/);
  if (localAdminMatch && localAdminMatch[1] && !reserved.includes(localAdminMatch[1])) {
    return localAdminMatch[1];
  }

  // Localhost student match: <slug>.localhost
  const localStudentMatch = host.match(/^([a-z0-9-]+)\.localhost$/);
  if (localStudentMatch && localStudentMatch[1] && !reserved.includes(localStudentMatch[1])) {
    return localStudentMatch[1];
  }

  // Admin app-host match: <slug>.admin.<APP_HOST>  (e.g. greenwood.admin.school-webapp-self.vercel.app)
  const adminAppHost = host.match(new RegExp(`^([a-z0-9-]+)\\.admin\\.${appHostPattern}$`));
  if (adminAppHost && adminAppHost[1] && !reserved.includes(adminAppHost[1])) {
    return adminAppHost[1];
  }

  // Admin match: <slug>.admin.nexacampus.tech
  const adminMatch = host.match(/^([a-z0-9-]+)\.admin\.nexacampus\.(?:tech|com)$/);
  if (adminMatch && adminMatch[1]) return adminMatch[1];

  // Admin Vercel match: <slug>-admin-nexacampus.vercel.app
  const adminVercel = host.match(/^([a-z0-9-]+)-admin-nexacampus\.vercel\.app$/);
  if (adminVercel && adminVercel[1]) return adminVercel[1];

  // Student app-host match: <slug>.<APP_HOST>  (e.g. greenwood.school-webapp-self.vercel.app)
  const studentAppHost = host.match(new RegExp(`^([a-z0-9-]+)\\.${appHostPattern}$`));
  if (studentAppHost && studentAppHost[1] && !reserved.includes(studentAppHost[1])) {
    return studentAppHost[1];
  }

  // Student match: <slug>.nexacampus.tech
  const studentMatch = host.match(/^([a-z0-9-]+)\.nexacampus\.(?:tech|com)$/);
  if (studentMatch && studentMatch[1] && !reserved.includes(studentMatch[1])) {
    return studentMatch[1];
  }

  // Student Vercel match: <slug>-nexacampus.vercel.app
  const studentVercel = host.match(/^([a-z0-9-]+)-nexacampus\.vercel\.app$/);
  if (studentVercel && studentVercel[1]) return studentVercel[1];

  // 4. Platform root paths: If on apex domain (localhost:3000, nexacampus.tech) and on universal platform pages,
  // do NOT leak residual tenant from cookies/localStorage
  const platformRoutes = ['/', '/chooser', '/maker', '/explore', '/privacy', '/terms', '/refund', '/cookies', '/data-deletion'];
  if (platformRoutes.some((p) => pathname === p || pathname.startsWith(p + '/')) && !qSlug) {
    return null;
  }

  // 5. Check cookie set by middleware (school_tenant_slug)
  const cookieMatch = document.cookie.match(/(?:^|;\s*)school_tenant_slug=([^;]+)/);
  if (cookieMatch && cookieMatch[1] && cookieMatch[1].trim() && cookieMatch[1].trim() !== 'platform') {
    return cookieMatch[1].trim().toLowerCase();
  }

  // 6. Check saved in localStorage as last resort
  const saved = localStorage.getItem('nexacampus_tenant_slug');
  if (saved && saved.trim() && saved !== 'platform') {
    return saved.trim().toLowerCase();
  }

  return null;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [slug, setSlug] = useState<string | null>(null);
  const [tenant, setTenant] = useState<SchoolTenant | null>(null);
  const [loading, setLoading] = useState(true);

  const isPlatformRoot = !slug;

  const loadTenant = useCallback(async (targetSlug: string | null) => {
    if (!targetSlug) {
      setTenant(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchSchoolBySlug(targetSlug);
      if (data) {
        setTenant(data);
      } else if (targetSlug === 'lcgvm') {
        setTenant(LCGVM_FLAGSHIP);
      } else {
        // Fallback placeholder if backend is unreachable
        setTenant({
          ...LCGVM_FLAGSHIP,
          subdomain_slug: targetSlug,
          school_name: `${targetSlug.toUpperCase()} Campus`,
          school_motto: 'Autonomous School OS • NexaCampus',
          student_domain: `https://${targetSlug}.nexacampus.tech`,
          admin_domain: `https://${targetSlug}.admin.nexacampus.tech`,
          vercel_fallback_domain: `https://${targetSlug}-nexacampus.vercel.app`,
        });
      }
    } catch {
      if (targetSlug === 'lcgvm') {
        setTenant(LCGVM_FLAGSHIP);
      } else {
        setTenant({
          ...LCGVM_FLAGSHIP,
          id: `sch-${targetSlug}`,
          subdomain_slug: targetSlug,
          school_name: `${targetSlug.toUpperCase()} School Campus`,
          school_motto: 'Autonomous School OS • NexaCampus',
          student_domain: `https://${targetSlug}.nexacampus.tech`,
          admin_domain: `https://${targetSlug}.admin.nexacampus.tech`,
          vercel_fallback_domain: `https://${targetSlug}-nexacampus.vercel.app`,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize and re-sync tenant slug on mount and whenever pathname changes
  useEffect(() => {
    const resolvedSlug = extractSlugFromWindow(pathname);
    setSlug(resolvedSlug);
    loadTenant(resolvedSlug);
  }, [pathname, loadTenant]);

  const setTenantSlug = useCallback((newSlug: string | null) => {
    const cleaned = newSlug ? newSlug.trim().toLowerCase() : null;
    setSlug(cleaned);
    if (typeof window !== 'undefined') {
      if (cleaned) {
        localStorage.setItem('nexacampus_tenant_slug', cleaned);
        document.cookie = `school_tenant_slug=${cleaned}; path=/; max-age=2592000; SameSite=Lax${sharedCookieDomainSuffix()}`;
      } else {
        localStorage.removeItem('nexacampus_tenant_slug');
        document.cookie = `school_tenant_slug=; path=/; max-age=0; SameSite=Lax${sharedCookieDomainSuffix()}`;
      }
    }
    loadTenant(cleaned);
  }, [loadTenant]);

  const reloadTenant = useCallback(async () => {
    await loadTenant(slug);
  }, [loadTenant, slug]);

  const updateModules = useCallback(
    async (modules: Record<string, boolean>): Promise<boolean> => {
      if (!slug) return false;
      const res = await updateSchoolModules(slug, modules);
      if (res) {
        setTenant(res);
        return true;
      }
      return false;
    },
    [slug]
  );

  const isModuleEnabled = useCallback(
    (moduleId: string): boolean => {
      // In platform root mode, all showcase modules are visible for exploration
      if (!tenant) return true;

      const activeMods = tenant.active_modules || {};
      const aliases = MODULE_ALIASES[moduleId] || [moduleId];

      // If any alias is explicitly configured
      for (const alias of aliases) {
        if (alias in activeMods) {
          return Boolean(activeMods[alias]);
        }
      }

      // Default to true for standard educational modules if not explicitly set to false
      return true;
    },
    [tenant]
  );

  return (
    <TenantContext.Provider
      value={{
        tenant,
        slug,
        isPlatformRoot,
        loading,
        isModuleEnabled,
        setTenantSlug,
        reloadTenant,
        updateModules,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
