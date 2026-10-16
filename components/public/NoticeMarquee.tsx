'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/context/TenantContext';

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

export const PLATFORM_NOTICES: NoticeItem[] = [
  {
    id: 'pn-1',
    gazetteId: 'NEXA/CLOUD/2026/01',
    title: 'NexaCampus Cloud: Instant Autonomous School Provisioning in 60 Seconds — Build Your School App Now',
    date: 'Active',
    category: 'Urgent',
    isNew: true,
    fileSize: 'Live Studio',
    downloadUrl: '/maker',
  },
  {
    id: 'pn-2',
    gazetteId: 'NEXA/DNS/2026/02',
    title: 'Multi-Tenant Subdomain Routing Online (*.nexacampus.tech & *.admin.nexacampus.tech)',
    date: 'Active',
    category: 'Administrative',
    isNew: true,
    fileSize: 'Operational',
  },
  {
    id: 'pn-3',
    gazetteId: 'NEXA/MOD/2026/03',
    title: 'Autonomous School OS: 15 Modular Micro-Services with Dynamic School-Level Toggles & Permissions',
    date: 'Active',
    category: 'Academic',
    isNew: false,
    fileSize: '15 Modules',
  },
];

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

export default function NoticeMarquee({ notices }: { notices?: NoticeItem[] }) {
  const { tenant, slug, isPlatformRoot } = useTenant();
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [isPaused, setIsPaused] = useState(false);

  // Generate dynamic institutional notices if tenant is active and custom notices weren't provided
  const prefix = (tenant?.subdomain_slug || slug || 'CAMPUS').toUpperCase();
  const board = tenant?.affiliation_board || 'Academic Board';
  const tenantNotices: NoticeItem[] = [
    {
      id: `${prefix}-1`,
      gazetteId: `${prefix}/CIR/2026/042`,
      title: `Schedule & Guidelines for ${board} 2026 Pre-Board Practical & Theory Examinations`,
      date: '12 Oct 2026',
      category: 'Examination',
      isNew: true,
      fileSize: '418 KB',
    },
    {
      id: `${prefix}-2`,
      gazetteId: `${prefix}/ADM/2026/015`,
      title: 'Admissions 2026-27: First Merit List & Verification Slot Allotment',
      date: '10 Oct 2026',
      category: 'Admission',
      isNew: true,
      fileSize: '620 KB',
    },
    {
      id: `${prefix}-3`,
      gazetteId: `${prefix}/SAF/2026/008`,
      title: 'Mandatory Safety Advisory: Campus Fire Drill & Evacuation Protocol Compliance Report',
      date: '08 Oct 2026',
      category: 'Urgent',
      isNew: false,
      fileSize: '295 KB',
    },
    {
      id: `${prefix}-4`,
      gazetteId: `${prefix}/ACAD/2026/031`,
      title: 'Annual Inter-School Science & Robotics Colloquium 2026 — Registration & Team Roster',
      date: '05 Oct 2026',
      category: 'Academic',
      isNew: false,
      fileSize: '512 KB',
    },
    {
      id: `${prefix}-5`,
      gazetteId: `${prefix}/FEE/2026/004`,
      title: 'Quarter-3 Fee Remittance Deadline Extension & Online Gateway Payment Reconciliation',
      date: '01 Oct 2026',
      category: 'Administrative',
      isNew: false,
      fileSize: '180 KB',
    },
  ];

  const resolvedNotices = notices ? notices : (isPlatformRoot ? PLATFORM_NOTICES : (tenant || slug ? tenantNotices : SAMPLE_NOTICES));
  const filteredNotices =
    activeTab === 'All' ? resolvedNotices : resolvedNotices.filter((n) => n.category === activeTab);

  const authorityName = tenant?.school_name || (isPlatformRoot ? 'NexaCampus Cloud Administration' : 'Autonomous Campus Administration');

  return (
    <div className="w-full bg-slate-900 dark:bg-[#070913] text-slate-100 border-y border-slate-800 dark:border-[#1a1d2e] transition-colors">
      {/* ============================================================ */}
      {/* DESKTOP VIEWPORT: HORIZONTAL TICKER BAR WITH BLINKING BADGES */}
      {/* ============================================================ */}
      <div className="hidden md:flex items-center max-w-7xl mx-auto px-6 py-2.5">
        {/* Ticker Header Tag */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-700/80 dark:border-[#1e2238] flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-300">
            {isPlatformRoot ? 'Platform Ticker' : 'Official Circulars'}
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
            {resolvedNotices.concat(resolvedNotices).map((notice, index) => (
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
        <div className="pl-4 border-l border-slate-700/80 dark:border-[#1e2238] flex-shrink-0">
          <button
            onClick={() => setSelectedNotice(resolvedNotices[0])}
            className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
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
      <div className="md:hidden px-4 py-3 bg-slate-900 dark:bg-[#070913] border-b border-slate-800 dark:border-[#1a1d2e] transition-colors">
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
          {resolvedNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="snap-start flex-shrink-0 w-[280px] bg-slate-800/90 dark:bg-[#10121d] rounded-lg p-3 border border-slate-700/70 dark:border-[#1e2238] hover:border-amber-400/50 transition-colors cursor-pointer"
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
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50 dark:border-[#1e2238] text-[10px] text-slate-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#12131e] text-slate-900 dark:text-slate-100 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 dark:border-[#22253b] transition-colors">
            {/* Modal Header */}
            <div className="bg-oxford dark:bg-[#070913] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 dark:border-[#1a1d2e] transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="font-serif font-bold text-sm text-amber-200">
                  Official Institutional Circular
                </span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-[#1d2136] pb-3 transition-colors">
                <div className="font-mono bg-slate-100 dark:bg-[#1a1d30] px-2.5 py-1 rounded-md text-oxford dark:text-amber-300 font-bold border border-slate-200 dark:border-[#272c47]">
                  Gazette Ref: {selectedNotice.gazetteId}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-medium font-mono">
                  Date of Promulgation: {selectedNotice.date}
                </div>
              </div>

              <h3 className="font-serif font-bold text-base md:text-lg text-slate-900 dark:text-white leading-snug">
                {selectedNotice.title}
              </h3>

              <div className="bg-parchment dark:bg-[#161828] p-4 rounded-xl border border-slate-200 dark:border-[#242840] text-xs text-slate-700 dark:text-slate-300 space-y-2 transition-colors">
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Issuing Authority:</strong> Office of the Principal &amp; Academic Council, {authorityName}.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Audience:</strong> All Concerned Students, Guardians &amp; Faculty Members.
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  Note: Digital circulars are cryptographically stamped and binding as per CISCE Regulations and Institutional Bylaws.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c2035] rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={`#download-${selectedNotice.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulated Download: Document ${selectedNotice.gazetteId} (${selectedNotice.fileSize}) verified.`);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-oxford hover:bg-slate-800 dark:bg-[#1c2ac8] dark:hover:bg-[#15209e] rounded-lg transition-colors shadow-sm cursor-pointer border border-transparent dark:border-[#3843bb]"
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
