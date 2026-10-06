'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

const CATEGORIES = [
  'All Notices',
  'Academic & Exams',
  'Events & Sports',
  'Holidays & Admin',
  'Fee Alerts',
];

export default function NoticesPage() {
  const [activeCategory, setActiveCategory] = useState('All Notices');
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [student, setStudent] = useState({
    name: 'Student',
    gradeSection: 'Class 12-E',
    rollNo: 'Roll #24',
    initials: 'ST',
  });

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    const st = s.student;
    const name = st.name || st.displayName || s.name || 'Student';
    const gradeSection = `Class ${st.grade || '12'}-${st.section || 'E'}`;
    const rollNo = `Roll #${String(st.rollNo || (st as Record<string, unknown>).rollNumber || '24')}`;
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0].toUpperCase())
      .join('') || 'ST';
    setStudent({ name, gradeSection, rollNo, initials });
  }, []);

  return (
    <PortalShell title="Notices" activePath="notices">
      <div className="flex flex-col w-full relative gap-space-md">
        {/* Ambient Atmospheric Backdrops */}
        <div className="absolute -top-12 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-80 -right-16 w-72 h-72 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>

        {/* Student Context Bar */}
        <div>
          <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-xs rounded-full shadow-sm">
            <div className="flex items-center gap-space-xs min-w-0">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-sm text-[10px]">
                {student.initials}
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-label-md text-label-md text-on-surface truncate">{student.name}</span>
                <span className="text-outline text-label-sm">•</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{student.gradeSection}</span>
                <span className="text-outline text-label-sm">•</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">{student.rollNo}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="inline-flex w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-tertiary font-bold tracking-tight">
                Active Sync
              </span>
            </div>
          </div>
        </div>

        {/* Hero Broadcast Announcement Card */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-container via-primary to-inverse-surface text-on-primary p-space-lg shadow-[0_12px_28px_-6px_rgba(28,42,200,0.3)]">
          <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-space-md opacity-10">
            <span className="material-symbols-outlined text-[96px]">campaign</span>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-space-sm mb-space-sm">
            <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-sm">
              <span className="material-symbols-outlined text-[14px]">priority_high</span>
              URGENT BROADCAST
            </div>
            <button
              aria-label="Listen to official audio circular"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-space-sm py-1 rounded-full text-on-primary transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">volume_up</span>
              <span className="font-label-sm text-label-sm">Audio Assist</span>
            </button>
          </div>

          <div className="relative z-10">
            <h2 className="font-headline-md text-headline-md text-on-primary tracking-tight leading-snug">
              Resumption of Regular Classes &amp; Annual Sports Day Registration
            </h2>
            <div className="flex items-center gap-1.5 mt-space-xs font-body-sm text-body-sm text-on-primary-container">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Issued today, 10:30 AM • Office of the Principal</span>
            </div>

            <div className="mt-space-md">
              <p
                className={`font-body-md text-body-md text-white/90 transition-all duration-300 ${
                  heroExpanded ? '' : 'line-clamp-2'
                }`}
              >
                All secondary &amp; senior secondary cohorts (Grades 9 to 12) shall resume in-person
                curriculum schedules starting this Wednesday. Preliminary trials for the Inter-House Track
                &amp; Field meet begin simultaneously at the Main Stadium Grounds.
              </p>
              <div className="mt-space-sm flex items-center justify-between pt-space-xs">
                <button
                  type="button"
                  onClick={() => setHeroExpanded(!heroExpanded)}
                  className="inline-flex items-center gap-1 font-label-md text-label-md text-tertiary-fixed hover:text-white transition-colors"
                >
                  <span>{heroExpanded ? 'Show Less' : 'Read Full Circular'}</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform">
                    {heroExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                <span className="font-label-sm text-label-sm text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
                  Ref: LCGVM/2026/09-B
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div>
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`flex-shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                  activeCategory === c
                    ? 'bg-primary text-on-primary shadow-[0_8px_16px_-4px_rgba(28,42,200,0.35)]'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface">Official Timeline</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              3 Recent
            </span>
          </div>
          <button className="flex items-center gap-1 font-label-sm text-label-sm text-primary hover:underline">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Archive</span>
          </button>
        </div>

        {/* Timeline-style Feed: 2 columns on laptop (lg:), single col on phone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          {/* NOTICE 1: PTM Schedule */}
          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  Mandatory Attendance
                </span>
                <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  24 Sep 2026 • 2:23 PM
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Parent-Teacher Meeting (PTM) Schedule for Class 12
              </h3>
              <div className="flex items-center gap-space-xs mt-1.5 mb-space-sm">
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-[11px] font-bold">
                  BP
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Biswarup Paul (Academic Coordinator)
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Dear Parents &amp; Guardians, please find attached the personalized slot timings and campus
                venue map for the upcoming Term 1 Parent-Teacher Review. Roll calls 1 to 30 will be seated in
                Block C Auditorium.
              </p>
              <div className="mt-space-md p-space-sm rounded-DEFAULT bg-surface-container-low flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-DEFAULT bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-label-md text-label-md text-on-surface truncate font-bold">
                      PTM_Schedule_2026.pdf
                    </div>
                    <div className="font-label-sm text-label-sm text-outline">
                      1.2 MB • Acrobat Document
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs mt-1 pt-space-xs">
                  <button className="flex-1 py-1.5 px-space-sm rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm active:scale-98 transition-transform">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download</span>
                  </button>
                  <button className="py-1.5 px-space-md rounded-full bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* NOTICE 2: Practical Exam Dates */}
          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[12px]">science</span>
                  Academic &amp; Exams
                </span>
                <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  21 Sep 2026 • 6:33 PM
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Revised Practical Examination Dates - Term 1
              </h3>
              <div className="flex items-center gap-space-xs mt-1.5 mb-space-sm">
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-[11px] font-bold">
                  EC
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Exam Controller Board
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Due to inter-district laboratory renovations, Computer Science and Physics Practical
                Sessions are rescheduled to commence from October 3rd. Keep lab logbooks updated and signed.
              </p>
              <Link
                href="/timetable"
                className="mt-space-md inline-flex items-center justify-between w-full p-space-sm rounded-DEFAULT bg-surface-container-low hover:bg-surface-container transition-colors group"
              >
                <div className="flex items-center gap-space-xs min-w-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    View Revised Practical Timetable
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* NOTICE 3: STEM & Robotics Exhibition */}
          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] lg:col-span-2">
            <div className="flex items-start justify-between gap-space-sm mb-space-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                Events &amp; Innovation
              </span>
              <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                18 Sep 2026
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Inter-School STEM &amp; Robotics Exhibition 2026
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-2">
              Nominations are now invited for team leads in IoT Automation, Line-Follower Bots, and Clean
              Energy Models. Faculty mentorship sessions start this Saturday.
            </p>
            <div className="mt-space-md flex items-center gap-space-xs">
              <button className="py-2 px-space-lg rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm active:scale-98 transition-transform">
                <span>Register Project Proposal</span>
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
