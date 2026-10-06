'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import {
  initOrRestoreStudentCache,
  DEFAULT_TIMETABLE_BY_DAY,
  type TimetablePeriod,
  getStudentIdentifier,
} from '@/lib/studentCache';
import { student as fallbackStudent } from '@/lib/data';

const DAYS = [
  { id: 'mon', label: 'MON 22', full: 'Monday' },
  { id: 'tue', label: 'TUE 23', full: 'Tuesday' },
  { id: 'wed', label: 'WED 24', full: 'Wednesday' },
  { id: 'thu', label: 'THU 25', full: 'Thursday' },
  { id: 'fri', label: 'FRI 26', full: 'Friday' },
];

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState('wed');
  const [timetable, setTimetable] = useState<Record<string, TimetablePeriod[]>>(
    DEFAULT_TIMETABLE_BY_DAY
  );
  const [student, setStudent] = useState({
    name: 'Student',
    section: 'Sec E',
    details: 'Class 12-E • Roll No. 20',
    initials: 'ST',
  });
  const [joinToast, setJoinToast] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student && !s?.name) {
      window.location.replace('/chooser');
      return;
    }
    const currentStudent = s?.student || { ...fallbackStudent, name: s.name || 'Student' };
    const name = currentStudent.displayName || currentStudent.name || s.name || 'Student';
    const grade = currentStudent.grade || '12';
    const section = currentStudent.section || 'E';
    const roll = currentStudent.rollNo || '20';

    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();

    setStudent({
      name,
      section: `Sec ${section}`,
      details: `Class ${grade}-${section} • Roll No. ${roll}`,
      initials,
    });

    // Hydrate timetable from student data cache
    const cache = initOrRestoreStudentCache(currentStudent, s.email);
    if (cache?.timetable) {
      setTimetable(cache.timetable);
    }
  }, []);

  const periods: TimetablePeriod[] =
    timetable[activeDay] || DEFAULT_TIMETABLE_BY_DAY[activeDay] || [];

  const activeDayMeta = DAYS.find((d) => d.id === activeDay) || DAYS[2];
  const labCount = periods.filter((p) => p.accent === 'tertiary').length;
  const theoryCount = periods.length - labCount;

  const handleJoinClass = (period: TimetablePeriod) => {
    setJoinToast(
      `Connecting to live classroom: ${period.subject} with ${period.teacher.split('·')[0].trim()}...`
    );
    setTimeout(() => {
      setJoinToast(null);
    }, 4500);
  };

  return (
    <PortalShell title="Timetable" activePath="timetable">
      <div className="flex flex-col gap-space-md w-full relative">
        {/* Toast / Notification when joining classroom */}
        {joinToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-outline/20 animate-fade-in max-w-[90vw]">
            <span className="material-symbols-outlined text-tertiary text-[20px] animate-spin">
              progress_activity
            </span>
            <span className="text-[13px] font-semibold">{joinToast}</span>
            <button
              onClick={() => setJoinToast(null)}
              className="ml-2 text-inverse-on-surface/60 hover:text-inverse-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Ambient Glows */}
        <div className="relative w-full">
          <div className="absolute -top-12 -left-10 w-48 h-48 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
          <div className="absolute top-28 -right-10 w-44 h-44 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none" />
        </div>

        {/* Student Context & Cache Synchronization Strip */}
        <section className="bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-3.5 sm:p-4 rounded-2xl border border-outline/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              {student.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-on-surface truncate">
                  {student.name}
                </span>
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {student.section}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant truncate mt-0.5">
                {student.details}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-outline flex-wrap">
            <div className="flex items-center gap-1.5 bg-tertiary/10 text-tertiary px-2.5 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span>Offline Cache Active</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>CISCE Curriculum 2026</span>
          </div>
        </section>

        {/* Day Selector Bar & Live Tracker Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {DAYS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                className={`px-4 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeDay === d.id
                    ? 'bg-primary text-white shadow-[0_8px_20px_-4px_rgba(28,42,200,0.4)] scale-[1.02]'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container active:scale-95'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Quick Metrics for Selected Day */}
          <div className="flex items-center gap-2 text-outline text-[12px]">
            <span className="bg-surface-container-high px-2.5 py-1 rounded-lg text-on-surface font-semibold text-[11px]">
              {activeDayMeta.full}: {periods.length} Periods ({labCount} Lab, {theoryCount} Theory)
            </span>
          </div>
        </div>

        {/* Schedule Cards Grid: 1 col on mobile, 2 col on tablet, 3 col on laptop */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-space-xs">
          {periods.map((p, idx) => (
            <div
              key={`${activeDay}-${idx}-${p.period}`}
              className={`rounded-[22px] p-5 transition-all shadow-sm flex flex-col justify-between border ${
                p.isLive
                  ? 'bg-gradient-to-br from-tertiary/10 via-surface-container-lowest to-surface-container-lowest border-tertiary/40 shadow-[0_8px_24px_-4px_rgba(0,80,54,0.18)] ring-1 ring-tertiary/20'
                  : 'bg-surface-container-lowest border-outline/10 hover:shadow-md hover:border-primary/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      p.isLive
                        ? 'bg-tertiary text-white shadow-sm'
                        : p.accent === 'tertiary'
                        ? 'bg-tertiary/15 text-tertiary font-bold'
                        : p.accent === 'secondary'
                        ? 'bg-secondary/15 text-secondary font-bold'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {p.isLive && (
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    )}
                    {p.isLive ? `LIVE NOW · ${p.period}` : p.period}
                  </span>
                  <span className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-outline">
                      schedule
                    </span>
                    {p.time}
                  </span>
                </div>

                <h3 className="text-[16px] font-bold text-on-surface leading-snug mt-1">
                  {p.subject}
                </h3>
                <p className="text-[13px] text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    person
                  </span>
                  {p.teacher}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline/10">
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    meeting_room
                  </span>
                  {p.room}
                </span>

                {p.isLive ? (
                  <button
                    onClick={() => handleJoinClass(p)}
                    className="px-3.5 py-1.5 bg-tertiary hover:bg-tertiary/90 active:scale-95 text-white rounded-full text-[12px] font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">videocam</span>
                    Join Class
                  </button>
                ) : (
                  <span className="text-[11px] text-outline font-medium">
                    {p.accent === 'tertiary' ? 'Laboratory' : p.accent === 'secondary' ? 'Elective' : 'Lecture'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Institutional Academic Advisory Card */}
        <section className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline/10 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">event_note</span>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-on-surface">
                Institutional Timetable Policy
              </h4>
              <p className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                Attendance is marked digitally at the beginning of each period. Laboratory sessions in Lab 3 require institutional safety coats and practical journals.
              </p>
            </div>
          </div>
          <Link
            href="/diary"
            className="text-[12px] font-bold text-primary hover:underline flex items-center gap-1 whitespace-nowrap self-start sm:self-center"
          >
            <span>Open Diary Tasks</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </section>
      </div>
    </PortalShell>
  );
}
