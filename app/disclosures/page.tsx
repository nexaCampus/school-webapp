'use client';

import React, { useEffect } from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import MandatoryDisclosuresTable from '@/components/public/MandatoryDisclosuresTable';
import FeeStructureTable from '@/components/public/FeeStructureTable';
import PortalFooter from '@/components/PortalFooter';
import { useTenant } from '@/lib/context/TenantContext';

export default function DisclosuresPage() {
  const { tenant, isPlatformRoot } = useTenant();
  const schoolName = tenant?.school_name || 'Lions Calcutta Greater Vidyamandir';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Mandatory Public Disclosures | ${schoolName}`;
    }
  }, [schoolName]);

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#101119] flex flex-col justify-between font-sans text-[#131b2e] dark:text-[#eaedff] transition-colors">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Page Title & Accreditation Gazette Badge */}
        <div className="border-b border-slate-300 dark:border-[#2b2f48] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
            <span>Appendix IX Compliance</span>
            <span>•</span>
            <span>Affiliation Bye-Laws 2026</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-oxford dark:text-[#eaedff] mt-1.5">
            Mandatory Public Disclosures &amp; Accreditation Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-[#a0a4c0] mt-2 max-w-3xl leading-relaxed">
            In compliance with directives issued by the Central Board of Secondary Education (CBSE) and the Council for the Indian School Certificate Examinations (CISCE), the institutional certifications, safety attestations, and audited fee schedules of {schoolName} are publicly promulgated below.
          </p>
        </div>

        {/* Section 1: Institutional General Information Card */}
        <section className="bg-white dark:bg-[#151622] rounded-xl shadow-xs border border-slate-200 dark:border-[#222538] overflow-hidden">
          <div className="p-5 bg-slate-50 dark:bg-[#101119] border-b border-slate-200 dark:border-[#222538] flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-oxford dark:text-[#eaedff]">
              A. General Institutional Information
            </h2>
            <span className="font-mono text-xs text-on-surface-variant">Form Appendix-IX (Part A)</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-[#101119] p-3 rounded border border-slate-100 dark:border-[#1e2133]">
                <span className="text-slate-400 dark:text-[#8a8fa8] block font-mono text-[10px] uppercase">Name of Institution</span>
                <span className="font-serif font-bold text-oxford dark:text-[#eaedff] text-sm">{schoolName}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#101119] p-3 rounded border border-slate-100 dark:border-[#1e2133]">
                <span className="text-slate-400 dark:text-[#8a8fa8] block font-mono text-[10px] uppercase">Affiliation Numbers</span>
                <span className="font-mono font-bold text-slate-800 dark:text-[#dfe2f4]">{tenant?.affiliation_board || 'CISCE'} {tenant?.subdomain_slug?.toUpperCase() || 'WB-243'}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#101119] p-3 rounded border border-slate-100 dark:border-[#1e2133]">
                <span className="text-slate-400 dark:text-[#8a8fa8] block font-mono text-[10px] uppercase">School Code</span>
                <span className="font-mono font-bold text-slate-800 dark:text-[#dfe2f4]">{tenant?.subdomain_slug?.toUpperCase() || 'WB-243'} (Higher Secondary)</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#101119] p-3 rounded border border-slate-100 dark:border-[#1e2133]">
                <span className="text-slate-400 dark:text-[#8a8fa8] block font-mono text-[10px] uppercase">Registered Address</span>
                <span className="font-medium text-slate-700 dark:text-[#c4c7e0]">{tenant?.city || 'Kolkata'}, {tenant?.state_territory || 'West Bengal'}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#101119] p-3 rounded border border-slate-100 dark:border-[#1e2133]">
                <span className="text-slate-400 dark:text-[#8a8fa8] block font-mono text-[10px] uppercase">Principal / Leadership</span>
                <span className="font-medium text-slate-700 dark:text-[#c4c7e0]">{tenant?.creator_name || 'Dr. S. Mukherjee'} ({tenant?.leadership_position || 'Head of Institution'})</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#101119] p-3 rounded border border-slate-100 dark:border-[#1e2133]">
                <span className="text-slate-400 dark:text-[#8a8fa8] block font-mono text-[10px] uppercase">Official Helpline &amp; Email</span>
                <span className="font-mono font-medium text-slate-700 dark:text-[#c4c7e0]">{tenant?.creator_phone || '+91 6289 652 321'} / desk@{tenant?.subdomain_slug || 'school'}.nexacampus.school</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mandatory Documents & Information Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-oxford dark:text-[#eaedff]">
              B. Documents & Information (Self-Attested Scans)
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">8 Verified Dockets</span>
          </div>
          <MandatoryDisclosuresTable />
        </section>

        {/* Section 3: Fee Structure Table */}
        <section id="fees" className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-oxford dark:text-[#eaedff]">
              C. Annual Fee Schedule & Installment Dues
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">Session 2026-27</span>
          </div>
          <FeeStructureTable />
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
