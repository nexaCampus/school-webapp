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
      <div className="flex flex-col gap-space-lg">
        {/* Top Metric & Quick Action Grid */}
        <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-space-md">
          {/* Main Attendance Metric Hero */}
          <section className="relative bg-gradient-to-br from-white/95 via-surface-container-lowest to-surface-container-low/80 rounded-lg p-space-lg shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center gap-space-md">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[22px] font-extrabold text-primary leading-none">95.8%</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">present</span>
              </div>
              <div className="flex-1">
                <p className="font-headline-sm text-headline-sm text-on-surface">22 / 24 days</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  1 absent · 1 late · 5 holidays
                </p>
                <span className="inline-flex items-center gap-1 mt-space-xs text-[11px] font-bold text-tertiary bg-tertiary/10 rounded-full px-2.5 py-1">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  14-day streak
                </span>
              </div>
            </div>
          </section>

          {/* Apply for Leave Action Card */}
          <section className="bg-surface-container-lowest rounded-lg shadow-sm p-space-lg flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[24px]">event_note</span>
              </span>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-on-surface">Apply for Student Leave</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Submit medical, planned, or emergency leave applications directly to class coordinator.
                </p>
              </div>
            </div>
            <Link
              href="/helpdesk"
              className="mt-4 w-full py-2.5 px-4 bg-primary text-on-primary rounded-full font-label-md text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>Submit Leave Request</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </section>
        </div>

        {/* Detailed Monthly Attendance Breakdown Table / Cards */}
        <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                October 2026 Log Breakdown
              </h3>
              <p className="font-body-sm text-body-sm text-outline">
                Verified biometrics &amp; period attendance roll
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-tertiary/10 text-tertiary rounded-full">
              Full Compliance
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase">Total Days</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1">24</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Academic working</span>
            </div>
            <div className="p-4 rounded-xl bg-tertiary/10 flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary uppercase">Present</span>
              <span className="font-headline-md text-headline-md text-tertiary font-bold mt-1">22</span>
              <span className="font-body-sm text-[11px] text-tertiary">Morning &amp; Lab</span>
            </div>
            <div className="p-4 rounded-xl bg-error/10 flex flex-col">
              <span className="font-label-sm text-label-sm text-error uppercase">Absent</span>
              <span className="font-headline-md text-headline-md text-error font-bold mt-1">1</span>
              <span className="font-body-sm text-[11px] text-error">Sick leave approved</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary-container/15 flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Late Marks</span>
              <span className="font-headline-md text-headline-md text-secondary font-bold mt-1">1</span>
              <span className="font-body-sm text-[11px] text-secondary">Bus route delayed</span>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
