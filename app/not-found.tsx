'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import DarkModeToggle from '@/components/DarkModeToggle';
import PortalFooter from '@/components/PortalFooter';

export default function NotFound() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = '404 - Page Not Found | NexaCampus School';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#12131a] text-[#131b2e] dark:text-[#eaedff] flex flex-col justify-between selection:bg-[#3b49df] selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#151622]/85 border-b border-[#e2e7ff]/70 dark:border-[#222538]/70 px-4 sm:px-6 lg:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <LogoEmblem className="h-10 w-10 drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] tracking-tight text-[#1c2ac8] dark:text-[#bdc2ff] group-hover:text-[#3b49df] transition-colors">
                NexaCampus
              </span>
              <span className="text-[11px] text-[#454655] dark:text-[#a0a4c0] font-medium hidden sm:inline-block">
                Lions Calcutta Greater Vidya Mandir • CISCE
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white text-[13px] font-bold shadow-sm shadow-[#1c2ac8]/25 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Portal Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main 404 Hero Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center">
          {/* Badge & Number */}
          <div className="relative mb-6">
            <span className="text-[90px] sm:text-[120px] font-black tracking-tighter text-[#1c2ac8]/10 dark:text-[#bdc2ff]/10 select-none leading-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#1c2ac8] to-[#3b49df] text-white shadow-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[42px] sm:text-[50px]">explore_off</span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2ac8]/10 text-[#1c2ac8] dark:text-[#bdc2ff] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1c2ac8] dark:bg-[#bdc2ff]" />
            Corridor Route Not Found
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#131b2e] dark:text-white tracking-tight leading-snug">
            Lost in the Campus Hallways?
          </h1>

          <p className="text-[#454655] dark:text-[#a0a4c0] text-sm sm:text-base mt-3 max-w-md leading-relaxed">
            The page or student record you are looking for has been relocated, expired, or does not exist on the current school server.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 w-full">
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white font-bold text-sm shadow-lg shadow-[#1c2ac8]/25 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Go to Student Dashboard</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] text-[#131b2e] dark:text-white font-bold text-sm hover:border-[#1c2ac8]/50 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Campus Homepage</span>
            </Link>
          </div>

          {/* Quick Fallback Shortcuts */}
          <div className="mt-10 pt-8 border-t border-[#e2e7ff] dark:border-[#222538] w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0] mb-4">
              Explore Active Campus Modules
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
              <Link
                href="/timetable"
                className="p-3 rounded-xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#1c2ac8]/40 hover:text-[#1c2ac8]dark:hover:text-[#bdc2ff] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                <span>Timetable</span>
              </Link>
              <Link
                href="/notices"
                className="p-3 rounded-xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#1c2ac8]/40 hover:text-[#1c2ac8]dark:hover:text-[#bdc2ff] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">campaign</span>
                <span>Notices</span>
              </Link>
              <Link
                href="/attendance"
                className="p-3 rounded-xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#1c2ac8]/40 hover:text-[#1c2ac8]dark:hover:text-[#bdc2ff] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">event_available</span>
                <span>Attendance</span>
              </Link>
              <Link
                href="/helpdesk"
                className="p-3 rounded-xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#1c2ac8]/40 hover:text-[#1c2ac8]dark:hover:text-[#bdc2ff] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">support_agent</span>
                <span>Help Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PortalFooter />
    </div>
  );
}
