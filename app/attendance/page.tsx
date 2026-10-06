'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function AttendancePage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Attendance" activePath="attendance">
      <div className="flex flex-col gap-3 sm:gap-space-lg">
        {/* Top Metric & Quick Action Grid */}
        <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-3 sm:gap-space-md">
          {/* Main Attendance Metric Hero */}
          <section className="relative bg-gradient-to-br from-white/95 via-surface-container-lowest to-surface-container-low/80 dark:from-[#252526] dark:via-[#252526] dark:to-[#252526] dark:border dark:border-[#3c3c3c] rounded-xl sm:rounded-lg p-3.5 sm:p-space-lg shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] dark:shadow-none overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-space-md">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[18px] sm:text-[22px] font-extrabold text-primary leading-none">95.8%</span>
                <span className="text-[10px] sm:text-body-sm text-on-surface-variant font-medium">present</span>
              </div>
              <div className="flex-1">
                <p className="text-[14px] sm:text-headline-sm font-bold text-on-surface">22 / 24 days</p>
                <p className="text-[11px] sm:text-body-sm text-on-surface-variant mt-0.5">
                  1 absent · 1 late · 5 holidays
                </p>
                <span className="inline-flex items-center gap-1 mt-1 sm:mt-space-xs text-[10px] sm:text-[11px] font-bold text-tertiary bg-tertiary/10 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1">
                  <span className="material-symbols-outlined text-[13px] sm:text-[14px]">local_fire_department</span>
                  14-day streak
                </span>
              </div>
            </div>
          </section>

          {/* Apply for Leave Action Card */}
          <section className="bg-surface-container-lowest dark:bg-[#252526] dark:border dark:border-[#3c3c3c] rounded-xl sm:rounded-lg shadow-sm p-3.5 sm:p-space-lg flex flex-col justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-fixed dark:bg-[#007acc]/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px]">event_note</span>
              </span>
              <div className="flex-1">
                <h3 className="text-[14px] sm:text-[16px] font-bold text-on-surface">Apply for Student Leave</h3>
                <p className="text-[11px] sm:text-body-sm text-on-surface-variant mt-0.5">
                  Submit medical, planned, or emergency leave applications directly to class coordinator.
                </p>
              </div>
            </div>
            <Link
              href="/helpdesk"
              className="mt-3 sm:mt-4 w-full py-2 sm:py-2.5 px-4 bg-primary text-on-primary rounded-full text-[12px] sm:text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>Submit Leave Request</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
            </Link>
          </section>
        </div>

        {/* Detailed Monthly Attendance Breakdown Table / Cards */}
        <section className="bg-white dark:bg-[#252526] rounded-xl sm:rounded-[14px] border border-outline/10 dark:border-[#3c3c3c] p-3.5 sm:p-space-lg shadow-sm">
          <div className="flex items-center justify-between mb-2.5 sm:mb-space-md">
            <div>
              <h3 className="text-[13.5px] sm:text-headline-sm font-bold text-on-surface">
                October 2026 Log Breakdown
              </h3>
              <p className="text-[10.5px] sm:text-body-sm text-outline">
                Verified biometrics &amp; period attendance roll
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 bg-tertiary/10 text-tertiary rounded-full">
              Full Compliance
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-[14px] bg-surface-container-low dark:bg-[#1e1e1e] border border-outline/10 dark:border-[#3c3c3c] flex flex-col">
              <span className="text-[10px] sm:text-label-sm text-outline uppercase tracking-wider font-semibold">Total Days</span>
              <span className="text-[18px] sm:text-headline-md text-on-surface font-bold mt-0.5 sm:mt-1">24</span>
              <span className="text-[10px] sm:text-[11px] text-on-surface-variant">Academic working</span>
            </div>
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-[14px] bg-tertiary/10 border border-tertiary/20 flex flex-col">
              <span className="text-[10px] sm:text-label-sm text-tertiary uppercase tracking-wider font-semibold">Present</span>
              <span className="text-[18px] sm:text-headline-md text-tertiary font-bold mt-0.5 sm:mt-1">22</span>
              <span className="text-[10px] sm:text-[11px] text-tertiary">Morning &amp; Lab</span>
            </div>
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-[14px] bg-error/10 border border-error/20 flex flex-col">
              <span className="text-[10px] sm:text-label-sm text-error uppercase tracking-wider font-semibold">Absent</span>
              <span className="text-[18px] sm:text-headline-md text-error font-bold mt-0.5 sm:mt-1">1</span>
              <span className="text-[10px] sm:text-[11px] text-error">Sick leave approved</span>
            </div>
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-[14px] bg-secondary-container/15 border border-secondary/20 flex flex-col">
              <span className="text-[10px] sm:text-label-sm text-secondary uppercase tracking-wider font-semibold">Late Marks</span>
              <span className="text-[18px] sm:text-headline-md text-secondary font-bold mt-0.5 sm:mt-1">1</span>
              <span className="text-[10px] sm:text-[11px] text-secondary">Bus route delayed</span>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
