'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import { useTenant } from '@/lib/context/TenantContext';

interface SchoolNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchoolNavDrawer({ isOpen, onClose }: SchoolNavDrawerProps) {
  const { tenant, slug: contextSlug, isPlatformRoot, isModuleEnabled } = useTenant();

  const slug = tenant?.subdomain_slug || contextSlug || '';
  const schoolName = tenant?.school_name || (slug ? `${slug.toUpperCase()} School Campus` : 'School Campus');
  const board = tenant?.affiliation_board || 'CBSE';
  const city = tenant?.city || 'Campus';
  const state = tenant?.state_territory || 'India';
  const phone = tenant?.creator_phone || '+91 6289652321';
  const email = tenant ? `office@${tenant.subdomain_slug}.nexacampus.tech` : (slug ? `office@${slug}.nexacampus.tech` : 'support@nexacampus.tech');
  const motto = tenant?.school_motto || 'Academic Excellence & Innovation';

  const signInUrl = slug ? `/chooser?tenant=${slug}` : '/chooser';
  const adminUrl = slug ? `/admin?tenant=${slug}` : '/admin';

  // Handle escape key to close drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${schoolName} Navigation Menu`}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-none sm:max-w-md sm:max-w-lg h-full bg-white dark:bg-[#0f111c] shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 dark:border-[#22263d] animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header: Institutional Crest & Identity */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1d2136] bg-slate-50/60 dark:bg-[#141726]/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <LogoEmblem className="h-11 w-11 flex-shrink-0 drop-shadow-sm" />
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {board} Affiliated
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-oxford dark:text-white leading-tight truncate">
                  {schoolName}
                </h3>
                <p className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                  {city}, {state} • {slug ? `${slug}.nexacampus.tech` : 'NexaCampus OS'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#1f243b] transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Close drawer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-sm sm:text-xs text-slate-600 dark:text-slate-400 font-serif italic line-clamp-1">
            &ldquo;{motto}&rdquo;
          </p>
        </div>

        {/* Drawer Body: 4 Institutional Core Categories */}
        <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Section 1: About School */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2136]">
              <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                1. About School
              </span>
              <span className="text-[10px] bg-oxford/10 dark:bg-white/10 text-oxford dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                Institutional
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <Link
                href="/#about"
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Principal&apos;s Desk &amp; Vision
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Leadership message and institutional charter
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </Link>

              <Link
                href={slug ? `/faculty?tenant=${slug}` : '/faculty'}
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Faculty &amp; Academic Leadership
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {tenant?.teacher_count || 48} qualified educators &amp; departments
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </Link>

              <Link
                href={slug ? `/disclosures?tenant=${slug}` : '/disclosures'}
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">policy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Statutory Board Disclosures
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Mandatory {board} public disclosures &amp; compliance
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </Link>

              <Link
                href="/maker"
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">build_circle</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    School Maker Studio
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Reconfigure active modules or provision subdomains
                  </div>
                </div>
                <span className="text-emerald-500 font-mono text-[10px] font-bold">OS SaaS</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Academics */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2136]">
              <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                2. Academics
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono">
                Curriculum &amp; Marks
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <Link
                href={slug ? `/academics?tenant=${slug}` : '/academics'}
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Curriculum &amp; Streams
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Science, Commerce, Humanities &amp; Secondary syllabus
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </Link>

              {isModuleEnabled('exams') && (
                <Link
                  href={slug ? `/exams?tenant=${slug}` : '/exams'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Board Examinations &amp; Marks
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Terminal reports, practicals &amp; merit percentiles
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              {isModuleEnabled('diary') && (
                <Link
                  href={slug ? `/diary?tenant=${slug}` : '/diary'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Homework &amp; Daily Diary
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Digital homework assignments &amp; teacher remarks
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              {isModuleEnabled('attendance') && (
                <Link
                  href={slug ? `/attendance?tenant=${slug}` : '/attendance'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Attendance System
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Biometric &amp; period-wise statutory attendance
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              <a
                href="#timetable-stream"
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Live Timetable &amp; Bell Stream
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Current period stream and synchronous bells
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </a>
            </div>
          </div>

          {/* Section 3: Campus Logistics */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2136]">
              <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                3. Campus Logistics
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">
                Fleet &amp; Dining
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {isModuleEnabled('bus') && (
                <Link
                  href={slug ? `/bus?tenant=${slug}` : '/bus'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Bus GPS Radar &amp; Telemetry
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Real-time bus tracking and driver contacts
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              {isModuleEnabled('canteen') && (
                <Link
                  href={slug ? `/canteen?tenant=${slug}` : '/canteen'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">restaurant</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Smart RFID Canteen Wallet
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Cashless meal wallet &amp; dietary allergen alerts
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              {isModuleEnabled('library') && (
                <Link
                  href={slug ? `/library?tenant=${slug}` : '/library'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">local_library</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Digital Library Catalog
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Book search, automated reservations &amp; dues
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              {isModuleEnabled('health') && (
                <Link
                  href={slug ? `/health?tenant=${slug}` : '/health'}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">medical_services</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                      Campus Infirmary &amp; Clinic
                    </div>
                    <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Health check records &amp; vital telemetry
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                </Link>
              )}

              <Link
                href={slug ? `/facilities?tenant=${slug}` : '/facilities'}
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">sports_soccer</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Campus Facilities &amp; Labs
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    STEM labs, sports arenas, auditorium &amp; IT suites
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* Section 4: Explore Campuses */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2136]">
              <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                4. Explore Campuses
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-mono">
                Directory
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <Link
                href="/explore"
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/15 hover:border-purple-500/30 transition-all group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">apartment</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Pan-India Campuses Directory
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Explore all institutions powered by NexaCampus
                  </div>
                </div>
                <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">Browse →</span>
              </Link>

              <Link
                href="/chooser"
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181c2e] transition-colors group"
              >
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] dark:group-hover:text-[#7b89ff]">
                    Switch School Campus
                  </div>
                  <div className="text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Universal school campus chooser &amp; search
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-600 text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Footer: Portals & Contact Hub */}
        <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-[#1d2136] bg-slate-50/70 dark:bg-[#141726]/70 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={signInUrl}
              onClick={onClose}
              className="w-full py-3 sm:py-2.5 px-3 rounded-xl bg-slate-200/80 dark:bg-[#1e2338] hover:bg-slate-300 dark:hover:bg-[#282e4a] text-sm sm:text-xs font-bold text-oxford dark:text-white text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Student Sign In</span>
            </Link>

            <Link
              href={adminUrl}
              onClick={onClose}
              className="w-full py-3 sm:py-2.5 px-3 rounded-xl bg-[#1c2ac8] hover:bg-[#15209e] text-sm sm:text-xs font-bold text-white text-center shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Admin Portal</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <a href={`tel:${phone}`} className="hover:text-oxford dark:hover:text-white flex items-center gap-1">
              <span>📞 {phone}</span>
            </a>
            <a href={`mailto:${email}`} className="hover:text-oxford dark:hover:text-white flex items-center gap-1">
              <span>✉️ {email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
