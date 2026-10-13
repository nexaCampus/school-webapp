'use client';

import React, { useState } from 'react';

interface FeeTier {
  id: string;
  gradeTier: string;
  classes: string;
  admissionFee: number; // One-time
  tuitionQuarterly: number; // Per quarter (x4)
  stemLabQuarterly: number;
  libraryAnnual: number;
  annualMaintenance: number;
  totalAnnual: number;
}

const FEE_TIERS: FeeTier[] = [
  {
    id: 'tier-pre',
    gradeTier: 'Pre-Primary Wing',
    classes: 'Nursery, Lower KG, Upper KG',
    admissionFee: 25000,
    tuitionQuarterly: 14500,
    stemLabQuarterly: 1200,
    libraryAnnual: 3500,
    annualMaintenance: 8000,
    totalAnnual: 99300,
  },
  {
    id: 'tier-pri',
    gradeTier: 'Primary Wing',
    classes: 'Classes I through V',
    admissionFee: 25000,
    tuitionQuarterly: 16800,
    stemLabQuarterly: 2400,
    libraryAnnual: 4200,
    annualMaintenance: 9500,
    totalAnnual: 115500,
  },
  {
    id: 'tier-mid',
    gradeTier: 'Middle Wing',
    classes: 'Classes VI through VIII',
    admissionFee: 25000,
    tuitionQuarterly: 18900,
    stemLabQuarterly: 3500,
    libraryAnnual: 4800,
    annualMaintenance: 10500,
    totalAnnual: 129900,
  },
  {
    id: 'tier-sec',
    gradeTier: 'Secondary Wing',
    classes: 'Classes IX & X (ICSE Board)',
    admissionFee: 30000,
    tuitionQuarterly: 21500,
    stemLabQuarterly: 4800,
    libraryAnnual: 5500,
    annualMaintenance: 12000,
    totalAnnual: 152700,
  },
  {
    id: 'tier-sr-sci',
    gradeTier: 'Senior Secondary (Science)',
    classes: 'Classes XI & XII (ISC Science)',
    admissionFee: 35000,
    tuitionQuarterly: 26000,
    stemLabQuarterly: 7500,
    libraryAnnual: 6500,
    annualMaintenance: 14000,
    totalAnnual: 189500,
  },
  {
    id: 'tier-sr-com',
    gradeTier: 'Senior Secondary (Commerce/Hum)',
    classes: 'Classes XI & XII (ISC Comm/Hum)',
    admissionFee: 35000,
    tuitionQuarterly: 23500,
    stemLabQuarterly: 3200,
    libraryAnnual: 6500,
    annualMaintenance: 14000,
    totalAnnual: 162300,
  },
];

const INSTALLMENT_DATES = [
  { quarter: 'Quarter 1 (Apr - Jun)', due: '10 April 2026', lateAfter: '25 April 2026' },
  { quarter: 'Quarter 2 (Jul - Sep)', due: '10 July 2026', lateAfter: '25 July 2026' },
  { quarter: 'Quarter 3 (Oct - Dec)', due: '10 October 2026', lateAfter: '25 October 2026' },
  { quarter: 'Quarter 4 (Jan - Mar)', due: '10 January 2027', lateAfter: '25 January 2027' },
];

export default function FeeStructureTable() {
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('tier-pre');

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Header and Print Action Bar */}
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy">
            Transparent Scholastic Accounting
          </span>
          <h3 className="font-serif font-bold text-xl md:text-2xl text-oxford mt-0.5">
            Annual Fee Schedule (Academic Session 2026-27)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Approved by the School Management Committee & Finance Bureau. No capitation fees or hidden levies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-oxford bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors shadow-xs"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Official Schedule</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP (1440px) MULTI-COLUMN COMPARATIVE TABLE             */}
      {/* ============================================================ */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Class Division / Tier</th>
              <th className="py-3.5 px-4 text-right">Admission (One-Time)</th>
              <th className="py-3.5 px-4 text-right">Tuition Fee (Quarterly)</th>
              <th className="py-3.5 px-4 text-right">STEM & Lab (Quarterly)</th>
              <th className="py-3.5 px-4 text-right">Library & Digital (Annual)</th>
              <th className="py-3.5 px-4 text-right">Annual Maintenance</th>
              <th className="py-3.5 px-4 text-right bg-amber-50/70 text-oxford font-extrabold">
                Total Annual Dues
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {FEE_TIERS.map((tier) => (
              <tr key={tier.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-serif font-bold text-sm text-oxford">
                    {tier.gradeTier}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {tier.classes}
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-700">
                  {formatINR(tier.admissionFee)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-700 font-semibold">
                  {formatINR(tier.tuitionQuarterly)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-700">
                  {formatINR(tier.stemLabQuarterly)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-700">
                  {formatINR(tier.libraryAnnual)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-700">
                  {formatINR(tier.annualMaintenance)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-sm font-extrabold text-oxford bg-amber-50/50">
                  {formatINR(tier.totalAnnual)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================================================ */}
      {/* MOBILE (375px) HORIZONTALLY SCROLLING CARDS & ACCORDIONS     */}
      {/* ============================================================ */}
      <div className="lg:hidden p-4">
        <div className="text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-wide">
          Swipe Across Class Tiers →
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-hide snap-x snap-mandatory">
          {FEE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="snap-start flex-shrink-0 w-[290px] bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-oxford text-amber-300">
                    Tier
                  </span>
                  <div className="font-serif font-extrabold text-base text-oxford">
                    {formatINR(tier.totalAnnual)}
                    <span className="text-[9px] font-sans font-normal text-slate-500 block text-right">
                      / year
                    </span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-sm text-oxford mt-2">
                  {tier.gradeTier}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">{tier.classes}</p>

                {/* Micro accordion details */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Admission (One-Time):</span>
                    <span className="font-bold">{formatINR(tier.admissionFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tuition (Per Qtr):</span>
                    <span className="font-bold text-oxford">{formatINR(tier.tuitionQuarterly)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Lab / STEM (Per Qtr):</span>
                    <span>{formatINR(tier.stemLabQuarterly)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Library & Annual Charges:</span>
                    <span>{formatINR(tier.libraryAnnual + tier.annualMaintenance)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <a
                  href="/apply"
                  className="w-full py-2 bg-oxford hover:bg-slate-800 text-white rounded text-xs font-bold text-center block"
                >
                  Apply for this Tier
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly Installment Dates Schedule Grid */}
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <h4 className="font-serif font-bold text-sm text-oxford mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Quarterly Remittance Deadlines & Grace Periods</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INSTALLMENT_DATES.map((inst) => (
            <div key={inst.quarter} className="bg-white p-3 rounded border border-slate-200 text-xs">
              <div className="font-bold text-slate-900">{inst.quarter}</div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Due Date:</span>
                <span className="font-mono font-bold text-oxford">{inst.due}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Late Fee After:</span>
                <span className="font-mono text-red-600 font-medium">{inst.lateAfter}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
