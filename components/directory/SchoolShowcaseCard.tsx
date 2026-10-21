'use client';

import React from 'react';
import Link from 'next/link';

export interface SchoolRecord {
  id: string;
  name: string;
  slug: string;
  affiliation: string;
  board: 'CBSE' | 'ICSE' | 'Cambridge' | 'State Board';
  location: string;
  state: string;
  institutionType: 'Co-ed' | 'Day Boarding' | 'Girls' | 'Boys';
  studentStrength: string;
  established: number;
  annualFeeRange: string;
  portalUrl: string;
  crestLetter: string;
  primaryColor: string;
  accentBadge: string;
  motto: string;
}

export default function SchoolShowcaseCard({
  school,
  onShare,
}: {
  school: SchoolRecord;
  onShare: (school: SchoolRecord) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#151622] rounded-xl overflow-hidden border border-slate-200 dark:border-[#262a40] shadow-xs hover:border-slate-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between group font-sans">
      <div>
        {/* Card Header & Decorative Top Border */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: school.primaryColor || '#0A192F' }}
        />

        {/* Live Preview / Hero Header Banner */}
        <div className="p-5 bg-slate-50/70 dark:bg-[#181a27] border-b border-slate-100 dark:border-[#262a40] flex flex-col gap-3 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-12 h-12 rounded-full text-white flex items-center justify-center font-serif font-bold text-base shadow-xs border-2 border-white dark:border-[#262a40] flex-shrink-0"
                style={{ backgroundColor: school.primaryColor || '#0A192F' }}
              >
                {school.crestLetter}
              </div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-[#25283d] text-slate-700 dark:text-slate-300">
                  {school.board}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Estd. {school.established}
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 flex-shrink-0">
              Active Tenant
            </span>
          </div>

          <h2 className="font-serif font-bold text-lg text-oxford dark:text-white leading-snug break-words group-hover:text-burgundy dark:group-hover:text-[#bdc2ff] transition-colors">
            {school.name}
          </h2>
        </div>

        {/* Card Body Metadata */}
        <div className="p-5 space-y-3">
          <div className="italic font-serif text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            “{school.motto}”
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="bg-slate-50 dark:bg-[#10111a] p-2 rounded border border-slate-100 dark:border-[#222538] transition-colors">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">Affiliation</span>
              <span className="font-bold text-oxford dark:text-slate-200 line-clamp-1">{school.affiliation}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#10111a] p-2 rounded border border-slate-100 dark:border-[#222538] transition-colors">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">Scholars</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{school.studentStrength}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#10111a] p-2 rounded border border-slate-100 dark:border-[#222538] transition-colors">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">Location</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{school.location}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#10111a] p-2 rounded border border-slate-100 dark:border-[#222538] transition-colors">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">Annual Fee</span>
              <span className="font-bold text-amber-800 dark:text-amber-400">{school.annualFeeRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-slate-50 dark:bg-[#181a27] border-t border-slate-200 dark:border-[#262a40] flex items-center justify-between gap-2 transition-colors">
        <button
          onClick={() => onShare(school)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-oxford dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#25283d] rounded-md transition-colors cursor-pointer"
          title="Share Portal & Printable QR"
          aria-label={`Share portal for ${school.name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={school.slug === 'lcgvm' ? '/' : (school.portalUrl || `/school/${school.slug}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-oxford dark:bg-[#3b49df] hover:bg-slate-800 dark:hover:bg-[#2d38be] transition-colors shadow-xs"
          >
            <span>Visit Web Portal</span>
            <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
