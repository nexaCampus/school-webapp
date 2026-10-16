'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/context/TenantContext';

interface ModuleGuardProps {
  moduleId: string;
  moduleName?: string;
  children: ReactNode;
}

export default function ModuleGuard({
  moduleId,
  moduleName,
  children,
}: ModuleGuardProps) {
  const { tenant, isModuleEnabled } = useTenant();

  if (!isModuleEnabled(moduleId)) {
    const schoolName = tenant?.school_name || 'this campus';
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#151622] border border-[#e2e7ff] dark:border-[#222538] shadow-lg space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
              Feature Restricted
            </span>
            <h2 className="text-xl font-bold font-serif text-[#131b2e] dark:text-white">
              Module Not Provisioned for this Campus
            </h2>
            <p className="text-xs text-[#454655] dark:text-[#a0a4c0] leading-relaxed">
              The <strong className="text-on-surface">{moduleName || moduleId}</strong> service has not been activated in the current module suite for {schoolName}. Institutional leaders can toggle and provision this module anytime in the School Administration console.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#222538] text-xs font-bold rounded-xl transition-colors"
            >
              ← Return Home
            </Link>
            <Link
              href={`/admin?tenant=${tenant?.subdomain_slug || ''}`}
              className="px-4 py-2.5 bg-[#1c2ac8] hover:bg-[#15209e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Manage in Admin Console
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
