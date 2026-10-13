'use client';

import React from 'react';

interface InstitutionalFact {
  metric: string;
  label: string;
  detail: string;
  icon: string;
}

const FACTS: InstitutionalFact[] = [
  {
    metric: '1:18',
    label: 'Student-Teacher Ratio',
    detail: 'Individualized academic attention & mentorship',
    icon: 'ratio',
  },
  {
    metric: '12.5 Acres',
    label: 'Campus Sprawl',
    detail: 'Green athletic fields & multi-wing facilities',
    icon: 'campus',
  },
  {
    metric: '14+ Labs',
    label: 'Specialized STEM Centers',
    detail: 'Robotics, AI, Physics, Chemistry & Biotech',
    icon: 'labs',
  },
  {
    metric: '100%',
    label: 'Historic Pass Record',
    detail: '35 Consecutive years of ICSE & ISC Board distinction',
    icon: 'pass',
  },
  {
    metric: '3,200+',
    label: 'Enrolled Scholars',
    detail: 'Nursery through Class XII across three shifts',
    icon: 'scholars',
  },
  {
    metric: '42 Ranks',
    label: 'National Top 100 Ranks',
    detail: 'National Olympiads, JEE & NEET qualifiers',
    icon: 'ranks',
  },
];

export default function QuickFactsBar() {
  return (
    <section className="w-full bg-oxford text-white py-10 px-6 border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8 flex-wrap gap-4">
          <div>
            <div className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold">
              Institutional Benchmark Indicators
            </div>
            <h2 className="font-serif font-bold text-2xl text-white mt-1">
              Academic Audits & Institutional Scale
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            Official Data Verified: Session 2025-26
          </div>
        </div>

        {/* High-Density Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              className="bg-slate-800/50 hover:bg-slate-800/80 rounded-lg p-4 border border-slate-700/60 transition-all hover:border-amber-400/40"
            >
              <div className="font-serif font-extrabold text-2xl md:text-3xl text-amber-300 tracking-tight">
                {fact.metric}
              </div>
              <div className="text-xs font-bold text-white mt-1 leading-snug">
                {fact.label}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight line-clamp-2">
                {fact.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
