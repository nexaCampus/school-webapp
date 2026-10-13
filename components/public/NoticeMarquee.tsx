'use client';

import React, { useState } from 'react';

export interface NoticeItem {
  id: string;
  gazetteId: string;
  title: string;
  date: string;
  category: 'Examination' | 'Academic' | 'Admission' | 'Urgent' | 'Administrative';
  isNew: boolean;
  fileSize: string;
  downloadUrl?: string;
}

export const SAMPLE_NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    gazetteId: 'LCGVM/CIR/2026/042',
    title: 'Schedule & Guidelines for ICSE/ISC 2026 Pre-Board Practical & Theory Examinations',
    date: '12 Oct 2026',
    category: 'Examination',
    isNew: true,
    fileSize: '418 KB',
  },
  {
    id: 'n-2',
    gazetteId: 'LCGVM/ADM/2026/015',
    title: 'Admissions 2026-27: First Merit List & Verification Slot Allotment (Nursery to Class IX)',
    date: '10 Oct 2026',
    category: 'Admission',
    isNew: true,
    fileSize: '620 KB',
  },
  {
    id: 'n-3',
    gazetteId: 'LCGVM/SAF/2026/008',
    title: 'Mandatory Safety Advisory: Campus Fire Drill & Evacuation Protocol Compliance Report',
    date: '08 Oct 2026',
    category: 'Urgent',
    isNew: false,
    fileSize: '295 KB',
  },
  {
    id: 'n-4',
    gazetteId: 'LCGVM/ACAD/2026/031',
    title: 'Annual Inter-School Science & Robotics Colloquium 2026 — Registration & Team Roster',
    date: '05 Oct 2026',
    category: 'Academic',
    isNew: false,
    fileSize: '512 KB',
  },
  {
    id: 'n-5',
    gazetteId: 'LCGVM/FEE/2026/004',
    title: 'Quarter-3 Fee Remittance Deadline Extension & Online Gateway Payment Reconciliation',
    date: '01 Oct 2026',
    category: 'Administrative',
    isNew: false,
    fileSize: '180 KB',
  },
];

export default function NoticeMarquee({ notices = SAMPLE_NOTICES }: { notices?: NoticeItem[] }) {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [isPaused, setIsPaused] = useState(false);

  const filteredNotices =
    activeTab === 'All' ? notices : notices.filter((n) => n.category === activeTab);

  return (
    <div className="w-full bg-slate-900 text-slate-100 border-y border-slate-800">
      {/* ============================================================ */}
      {/* DESKTOP VIEWPORT: HORIZONTAL TICKER BAR WITH BLINKING BADGES */}
      {/* ============================================================ */}
      <div className="hidden md:flex items-center max-w-7xl mx-auto px-6 py-2.5">
        {/* Ticker Header Tag */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-700/80 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-300">
            Official Circulars
          </span>
        </div>

        {/* Marquee Content */}
        <div
          className="flex-1 overflow-hidden relative mx-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center space-x-12 whitespace-nowrap ${
              isPaused ? '' : 'animate-[marquee_35s_linear_infinite]'
            }`}
          >
            {notices.concat(notices).map((notice, index) => (
              <button
                key={`${notice.id}-${index}`}
                onClick={() => setSelectedNotice(notice)}
                className="inline-flex items-center gap-2.5 text-xs text-slate-200 hover:text-amber-300 transition-colors text-left group cursor-pointer"
              >
                {notice.isNew && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wide animate-pulse">
                    NEW
                  </span>
                )}
                <span className="font-mono text-[11px] text-slate-400 group-hover:text-amber-400">
                  [{notice.gazetteId}]
                </span>
                <span className="font-medium underline-offset-2 group-hover:underline">
                  {notice.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">({notice.date})</span>
              </button>
            ))}
          </div>
        </div>

        {/* View All / Archive Action */}
        <div className="pl-4 border-l border-slate-700/80 flex-shrink-0">
          <button
            onClick={() => setSelectedNotice(notices[0])}
            className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 flex items-center gap-1"
          >
            <span>Notice Board</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE VIEWPORT (375px): HORIZONTAL SWIPEABLE NOTICES CARDS   */}
      {/* ============================================================ */}
      <div className="md:hidden px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-serif font-bold text-xs uppercase tracking-wide text-amber-300">
              Latest Circulars & Orders
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Swipe →</span>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex overflow-x-auto space-x-3 pb-1 scrollbar-hide snap-x snap-mandatory">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="snap-start flex-shrink-0 w-[280px] bg-slate-800/90 rounded-lg p-3 border border-slate-700/70 hover:border-amber-400/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-amber-300 font-semibold">
                  {notice.gazetteId}
                </span>
                {notice.isNew && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-600 text-white">
                    NEW
                  </span>
                )}
              </div>
              <h4 className="text-xs font-medium text-slate-100 line-clamp-2 leading-snug">
                {notice.title}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400">
                <span>{notice.date}</span>
                <span className="font-mono text-amber-400/80">PDF • {notice.fileSize}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* NOTICES DETAIL & VERIFIED PDF INSPECTION MODAL               */}
      {/* ============================================================ */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-slate-300">
            {/* Modal Header */}
            <div className="bg-oxford text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="font-serif font-bold text-sm text-amber-200">
                  Official Institutional Circular
                </span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
                <div className="font-mono bg-slate-100 px-2 py-1 rounded text-oxford font-bold">
                  Gazette Ref: {selectedNotice.gazetteId}
                </div>
                <div className="text-slate-500 font-medium">
                  Date of Promulgation: {selectedNotice.date}
                </div>
              </div>

              <h3 className="font-serif font-bold text-base md:text-lg text-slate-900 leading-snug">
                {selectedNotice.title}
              </h3>

              <div className="bg-parchment p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                <p>
                  <strong>Issuing Authority:</strong> Office of the Principal & Academic Council, Lions Calcutta Greater Vidyamandir.
                </p>
                <p>
                  <strong>Audience:</strong> All Concerned Students, Guardians & Faculty Members.
                </p>
                <p className="text-slate-500 italic">
                  Note: Digital circulars are cryptographically stamped and binding as per CISCE Regulations and Institutional Bylaws.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Close
                </button>
                <a
                  href={`#download-${selectedNotice.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulated Download: Document ${selectedNotice.gazetteId} (${selectedNotice.fileSize}) verified.`);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-oxford hover:bg-slate-800 rounded-md transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Attested Copy ({selectedNotice.fileSize})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
