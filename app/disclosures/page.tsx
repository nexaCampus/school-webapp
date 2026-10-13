'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import MandatoryDisclosuresTable from '@/components/public/MandatoryDisclosuresTable';
import FeeStructureTable from '@/components/public/FeeStructureTable';
import PortalFooter from '@/components/PortalFooter';

export default function DisclosuresPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-between font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Page Title & Accreditation Gazette Badge */}
        <div className="border-b border-slate-300 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-burgundy">
            <span>Appendix IX Compliance</span>
            <span>•</span>
            <span>Affiliation Bye-Laws 2026</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-oxford mt-1.5">
            Mandatory Public Disclosures & Accreditation Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            In compliance with directives issued by the Central Board of Secondary Education (CBSE) and the Council for the Indian School Certificate Examinations (CISCE), the institutional certifications, safety attestations, and audited fee schedules of Lions Calcutta Greater Vidyamandir are publicly promulgated below.
          </p>
        </div>

        {/* Section 1: Institutional General Information Card */}
        <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-oxford">
              A. General Institutional Information
            </h2>
            <span className="font-mono text-xs text-slate-500">Form Appendix-IX (Part A)</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Name of Institution</span>
                <span className="font-serif font-bold text-oxford text-sm">Lions Calcutta Greater Vidyamandir</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Affiliation Numbers</span>
                <span className="font-mono font-bold text-slate-800">CISCE WB-243 / CBSE 1930281</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">School Code</span>
                <span className="font-mono font-bold text-slate-800">WB-243 (Higher Secondary)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Registered Address</span>
                <span className="font-medium text-slate-700">12, Dr. Rajendra Prasad Sarani, Kolkata 700078</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Principal & Qualification</span>
                <span className="font-medium text-slate-700">Dr. S. Mukherjee (M.Sc., Ph.D., B.Ed.)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Official Helpline & Email</span>
                <span className="font-mono font-medium text-slate-700">+91 33 2442-8000 / principal@lcgvm.edu.in</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mandatory Documents & Information Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-oxford">
              B. Documents & Information (Self-Attested Scans)
            </h2>
            <span className="text-xs font-mono text-slate-500">8 Verified Dockets</span>
          </div>
          <MandatoryDisclosuresTable />
        </section>

        {/* Section 3: Fee Structure Table */}
        <section id="fees" className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-oxford">
              C. Annual Fee Schedule & Installment Dues
            </h2>
            <span className="text-xs font-mono text-slate-500">Session 2026-27</span>
          </div>
          <FeeStructureTable />
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
