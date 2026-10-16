'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import AdmissionWizard from '@/components/public/AdmissionWizard';
import FeeStructureTable from '@/components/public/FeeStructureTable';
import PortalFooter from '@/components/PortalFooter';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#101119] flex flex-col justify-between font-sans text-[#131b2e] dark:text-[#eaedff] transition-colors">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        <AdmissionWizard />

        <section className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-oxford dark:text-white">
              Class-Wise Fee Reference Table
            </h2>
            <span className="text-xs font-mono text-slate-500">Academic Year 2026-27</span>
          </div>
          <FeeStructureTable />
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
