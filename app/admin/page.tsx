'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PublicHeader from '@/components/public/PublicHeader';
import PortalFooter from '@/components/PortalFooter';
import { useTenant } from '@/lib/context/TenantContext';
import { tenantPortalUrls, sanitizeSlug } from '@/lib/tenantUrls';
import RequireSession from '@/components/common/RequireSession';

interface ModuleDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: string;
}

const ALL_15_MODULES: ModuleDef[] = [
  { id: 'canteen', title: 'Canteen Access', desc: 'Cashless meal wallet, RFID dining & dietary monitoring', icon: 'restaurant', category: 'Logistics' },
  { id: 'bus', title: 'Bus / Transport Access', desc: 'Live GPS bus fleet radar, geofenced alerts & stops', icon: 'directions_bus', category: 'Logistics' },
  { id: 'library', title: 'Library Access', desc: 'Barcode scan-to-borrow, book reservation & digital OPAC', icon: 'local_library', category: 'Academics' },
  { id: 'attendance', title: 'Attendance Access', desc: 'Period-wise register & 75% statutory alert threshold', icon: 'event_available', category: 'Academics' },
  { id: 'diary', title: 'Homework & Daily Diary', desc: 'Daily teacher assignments, remarks & submission receipts', icon: 'auto_stories', category: 'Academics' },
  { id: 'exams', title: 'Examinations & Report Cards', desc: 'Terminal marksheets, grade cards & digital admit passes', icon: 'workspace_premium', category: 'Academics' },
  { id: 'timetable', title: 'Timetable & Bell Stream', desc: 'Dynamic period stream, live subject bells & room mapping', icon: 'schedule', category: 'Academics' },
  { id: 'fees', title: 'Fee Remittance & Ledger', desc: 'Online fee gateway, ledger receipts & quarterly due alert', icon: 'account_balance_wallet', category: 'Finance' },
  { id: 'hallpass', title: 'E-Hallpass Movement', desc: 'Encrypted QR movement corridor passes & staff approvals', icon: 'badge', category: 'Security' },
  { id: 'clubs', title: 'Student Clubs & Houses', desc: 'Robotics, MUN, Debating, House shield leaderboards', icon: 'groups', category: 'Student Life' },
  { id: 'health', title: 'Medical & Infirmary Records', desc: 'Emergency allergy logs, triage telemetry & guardian dispatch', icon: 'local_hospital', category: 'Health' },
  { id: 'notices', title: 'Circulars & Notice Board', desc: 'Official administrative gazette & cryptographically stamped notices', icon: 'campaign', category: 'Administration' },
  { id: 'ptm', title: 'Parent-Teacher Meetings (PTM)', desc: 'Slot scheduling, video conference links & teacher notes', icon: 'handshake', category: 'Community' },
  { id: 'store', title: 'School Store & Uniforms', desc: 'Prescribed textbooks, house uniforms & lab gear orders', icon: 'storefront', category: 'Logistics' },
  { id: 'lostfound', title: 'Lost & Found Registry', desc: 'Photo-verified misplacement tracking & recovery locker', icon: 'search', category: 'Student Life' },
];

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const queryTenant = searchParams.get('tenant') || searchParams.get('school');
  const { tenant, slug, isPlatformRoot, isModuleEnabled, updateModules, reloadTenant, setTenantSlug } = useTenant();

  // Local state for module toggles
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync tenant slug if passed via query param (e.g. from middleware rewrite /s/:slug/admin -> /admin?tenant=:slug)
  useEffect(() => {
    if (queryTenant && queryTenant.trim()) {
      const clean = queryTenant.trim().toLowerCase();
      if (!tenant || tenant.subdomain_slug.toLowerCase() !== clean) {
        setTenantSlug(clean);
      }
    }
  }, [queryTenant, tenant, setTenantSlug]);

  useEffect(() => {
    if (tenant) {
      const initial: Record<string, boolean> = {};
      ALL_15_MODULES.forEach((mod) => {
        initial[mod.id] = isModuleEnabled(mod.id);
      });
      setModuleStates(initial);
    }
  }, [tenant, isModuleEnabled]);

  const toggleModule = (id: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setSaveSuccess(false);
  };

  const handleSaveModules = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const ok = await updateModules(moduleStates);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to persist module configuration to backend.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'An unexpected error occurred while updating modules.');
    } finally {
      setIsSaving(false);
    }
  };

  const effectiveSlug = sanitizeSlug(tenant?.subdomain_slug || queryTenant || slug || '');
  const schoolName = tenant?.school_name || (effectiveSlug ? `${effectiveSlug.toUpperCase()} School Campus` : 'NexaCampus Administrative Center');
  const board = tenant?.affiliation_board || 'Academic Board';
  const displaySlug = effectiveSlug || 'portal';
  const motto = tenant?.school_motto || 'Knowledge & Excellence';
  const activeCount = Object.values(moduleStates).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#101119] flex flex-col justify-between font-sans text-[#131b2e] dark:text-[#eaedff]">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ============================================================ */}
        {/* ADMIN EXECUTIVE HEADER CARD                                  */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#151622] p-6 sm:p-8 rounded-3xl border border-[#e2e7ff] dark:border-[#222538] shadow-[0_8px_30px_rgba(28,42,200,0.06)] dark:shadow-none flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Administrative &amp; Principal Control Center</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131b2e] dark:text-white">
              {schoolName}
            </h1>

            <p className="text-xs text-[#454655] dark:text-[#a0a4c0] font-serif italic">
              “{motto}” • {board} Affiliated • Subdomain: <span className="font-mono text-[#1c2ac8] dark:text-[#bdc2ff] font-bold">{displaySlug}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#454655] dark:text-[#a0a4c0]">
              <div className="bg-[#f2f3ff] dark:bg-[#101119] px-2.5 py-1 rounded-lg border border-[#e2e7ff] dark:border-[#222538]">
                <strong>Faculty:</strong> {tenant?.teacher_count || '48'} Teachers
              </div>
              <div className="bg-[#f2f3ff] dark:bg-[#101119] px-2.5 py-1 rounded-lg border border-[#e2e7ff] dark:border-[#222538]">
                <strong>Scholars:</strong> {tenant?.enrolled_scholars || '1,850'} Enrolled
              </div>
              <div className="bg-[#f2f3ff] dark:bg-[#101119] px-2.5 py-1 rounded-lg border border-[#e2e7ff] dark:border-[#222538]">
                <strong>Active Modules:</strong> {activeCount} of 15 Online
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              href="/admin/cms"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#f2f3ff] dark:bg-[#1c1f30] hover:bg-[#e4e7ff] text-xs font-bold rounded-xl border border-[#e2e7ff] dark:border-[#2a2e45] text-center transition-colors"
            >
              Notice CMS &amp; Gazette →
            </Link>
            <a
              href={tenantPortalUrls(effectiveSlug).appDomain}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#1c2ac8] hover:bg-[#15209e] text-white text-xs font-bold rounded-xl shadow-sm text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Public Portal</span>
              <span className="text-amber-300">↗</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ISSUE 4: DYNAMIC 15-MODULE ACCESS CONTROL PANEL             */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#151622] p-6 sm:p-8 rounded-3xl border border-[#e2e7ff] dark:border-[#222538] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2e7ff] dark:border-[#222538] pb-4 gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#721121] dark:text-rose-400">
                Institutional Feature Orchestration
              </div>
              <h2 className="text-xl font-serif font-bold text-[#131b2e] dark:text-white mt-0.5">
                Dynamic 15-Module Access Toggles
              </h2>
              <p className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-0.5">
                Toggle features on or off in real-time. Disabling a module immediately hides its routes and navigation links across both Admin and Student portals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveModules}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#1c2ac8] hover:bg-[#15209e] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Save Module Configuration</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>15-Module configuration persisted to Go database successfully!</span>
            </div>
          )}
          {saveError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-bold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{saveError}</span>
            </div>
          )}

          {/* 15 Modules Toggle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_15_MODULES.map((mod) => {
              const isEnabled = Boolean(moduleStates[mod.id]);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isEnabled
                      ? 'bg-[#faf8ff] dark:bg-[#181a26] border-[#1c2ac8]/40 dark:border-[#3b49df]/50 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#12131a] border-slate-200 dark:border-[#1e202f] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0]">
                        {mod.category}
                      </span>
                      {/* Toggle Switch */}
                      <div
                        className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                          isEnabled ? 'bg-[#1c2ac8]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-[#ffffff] dark:bg-[#eaedff] transition-transform ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="material-symbols-outlined text-[20px] text-[#1c2ac8] dark:text-[#bdc2ff]">
                        {mod.icon}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-[#131b2e] dark:text-white">
                        {mod.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#454655] dark:text-[#a0a4c0] leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-outline/10 text-[10px] font-mono font-bold flex items-center justify-between">
                    <span className={isEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                      {isEnabled ? '● Active in Portal' : '○ Disabled'}
                    </span>
                    <span className="text-slate-400">/{mod.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8ff] dark:bg-[#101119] flex items-center justify-center p-6 text-on-surface">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-xs font-semibold text-outline">Loading Campus Administrative Portal...</span>
          </div>
        </div>
      }
    >
      <RequireSession mode="creator">
        <AdminDashboardContent />
      </RequireSession>
    </React.Suspense>
  );
}
