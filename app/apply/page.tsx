'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import AdmissionWizard from '@/components/public/AdmissionWizard';
import FeeStructureTable from '@/components/public/FeeStructureTable';
import PortalFooter from '@/components/PortalFooter';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-between font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        <AdmissionWizard />

        <section className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-oxford">
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
