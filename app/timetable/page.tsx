'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

const DAYS = [
  { id: 'mon', label: 'MON 22' },
  { id: 'tue', label: 'TUE 23' },
  { id: 'wed', label: 'WED 24' },
  { id: 'thu', label: 'THU 25' },
  { id: 'fri', label: 'FRI 26' },
];

const PERIODS = [
  {
    period: 'P1',
    isLive: true,
    time: '08:30 – 09:30 AM',
    subject: 'Physics Lab (Optics & Laser)',
    teacher: 'Dr. Aris Thorne · Physics Lab 3',
    room: 'Lab 3',
    accent: 'tertiary',
  },
  {
    period: 'P2',
    isLive: false,
    time: '09:40 – 10:35 AM',
    subject: 'Mathematics II (Calculus)',
    teacher: 'Mrs. S. Roy · Room 402',
    room: 'Room 402',
    accent: 'primary',
  },
  {
    period: 'P3',
    isLive: false,
    time: '10:45 – 11:40 AM',
    subject: 'Chemistry (Aldehydes & Ketones)',
    teacher: 'Mrs. D. Sen · Room 305',
    room: 'Room 305',
    accent: 'primary',
  },
  {
    period: 'P4',
    isLive: false,
    time: '12:00 – 12:55 PM',
    subject: 'Computer Science (Python & SQL)',
    teacher: 'Mr. A. Banerjee · Computer Lab 2',
    room: 'Comp Lab 2',
    accent: 'primary',
  },
  {
    period: 'P5',
    isLive: false,
    time: '01:00 – 01:50 PM',
    subject: 'English Core (Literature & Composition)',
    teacher: 'Ms. K. Mukherjee · Room 402',
    room: 'Room 402',
    accent: 'primary',
  },
  {
    period: 'P6',
    isLive: false,
    time: '02:00 – 02:45 PM',
    subject: 'Physical Education / Sports Elective',
    teacher: 'Coach V. Sharma · Main Grounds',
    room: 'Sports Complex',
    accent: 'primary',
  },
];

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState('wed');

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Timetable" activePath="timetable">
      <div className="flex flex-col gap-space-md">
        {/* Day Selector Bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
            {DAYS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeDay === d.id
                    ? 'bg-primary text-white shadow-[0_8px_20px_-4px_rgba(28,42,200,0.4)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-outline text-[12px]">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
            <span>Live Class Tracker</span>
          </div>
        </div>

        {/* Schedule Cards Grid: 1 col on mobile, 2 col on tablet, 3 col on laptop */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-space-xs">
          {PERIODS.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-[20px] p-5 transition-all shadow-sm flex flex-col justify-between ${
                p.isLive
                  ? 'bg-tertiary/10 border-2 border-tertiary/30 shadow-[0_8px_24px_-4px_rgba(0,80,54,0.15)]'
                  : 'bg-surface-container-lowest hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.isLive ? 'bg-tertiary text-white' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {p.isLive ? `LIVE NOW · ${p.period}` : p.period}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    {p.time}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-on-surface leading-snug mt-1">
                  {p.subject}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{p.teacher}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline/10">
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">meeting_room</span>
                  {p.room}
                </span>
                {p.isLive && (
                  <button className="px-3 py-1 bg-tertiary text-white rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">login</span>
                    Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </PortalShell>
  );
}
