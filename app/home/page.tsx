'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import {
  initOrRestoreStudentCache,
  DEFAULT_TIMETABLE_BY_DAY,
  DEFAULT_IMPORTANT_DATES,
  type TimetablePeriod,
  type ImportantDate,
} from '@/lib/studentCache';
import { student as fallbackStudent } from '@/lib/data';

export default function HomePage() {
  const [student, setStudent] = useState({
    name: 'Student',
    gradeSection: 'Class 12 - E',
    rollNo: 'Roll No. 20',
    initials: 'ST',
  });
  const [pendingDiaryCount, setPendingDiaryCount] = useState<number>(2);
  const [todayPeriods, setTodayPeriods] = useState<TimetablePeriod[]>(
    DEFAULT_TIMETABLE_BY_DAY.wed
  );
  const [nextSchoolEvent, setNextSchoolEvent] = useState<ImportantDate | null>(
    DEFAULT_IMPORTANT_DATES[0]
  );

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
      gradeSection: `Class ${grade} - ${section}`,
      rollNo: `Roll No. ${roll}`,
      initials,
    });

    // Hydrate timetable, diary tasks, and important dates from student cache
    const cache = initOrRestoreStudentCache(currentStudent, s.email);
    if (cache) {
      const pending = cache.diaryTasks.filter((t) => t.status === 'Pending').length;
      setPendingDiaryCount(pending);
      const dayMap: Record<number, string> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
      const currentDayKey = dayMap[new Date().getDay()] || 'wed';
      setTodayPeriods(
        cache.timetable[currentDayKey] || cache.timetable.wed || DEFAULT_TIMETABLE_BY_DAY.wed
      );
      if (cache.importantDates && cache.importantDates.length > 0) {
        setNextSchoolEvent(cache.importantDates[0]);
      }
    }
  }, []);

  return (
    <PortalShell title="Home" activePath="home">
      {/* Subtle Atmospheric Orbs */}
      <div className="relative w-full dark:hidden">
        <div className="absolute -top-12 -left-10 w-48 h-48 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-28 -right-10 w-44 h-44 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>
      </div>

      {/* Student Welcome Banner Card (Elevated Frosted Hero Slab) */}
      <section className="relative mt-space-sm bg-gradient-to-br from-white/95 via-surface-container-lowest/90 to-surface-container-low/80 dark:from-[#252526] dark:via-[#252526] dark:to-[#252526] dark:bg-[#252526] backdrop-blur-xl rounded-[16px] border border-outline/10 dark:border-[#3c3c3c] p-space-lg shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] dark:shadow-none overflow-hidden">
        {/* Ambient Accent Glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none dark:hidden"></div>
        <div className="flex items-start justify-between gap-space-md relative z-10">
          <div className="flex items-center gap-space-md min-w-0">
            {/* Student Avatar with Verified Ring */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_6px_16px_rgba(28,42,200,0.18)] dark:shadow-none bg-primary-fixed dark:bg-[#007acc]/20 flex items-center justify-center text-primary dark:text-[#3794ff] font-extrabold text-xl">
                <span>{student.initials}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center text-[12px] shadow-sm">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </span>
            </div>
            {/* Greeting & Credentials */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Good Morning
                </span>
                <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-tertiary"></span>
              </div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface truncate">
                {student.name}
              </h1>
              <div className="flex items-center gap-space-xs flex-wrap mt-0.5">
                <span className="font-label-md text-label-md bg-surface-container dark:bg-[#1e1e1e] dark:border dark:border-[#3c3c3c] px-2.5 py-0.5 rounded-full text-primary font-bold">
                  {student.gradeSection}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {student.rollNo}
                </span>
              </div>
            </div>
          </div>
          {/* Quick Date Dial */}
          <div className="flex flex-col items-center bg-surface-container-low dark:bg-[#1e1e1e] px-3 py-2 rounded-[10px] border border-outline/10 dark:border-[#3c3c3c] text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-outline uppercase">Sep</span>
            <span className="font-headline-md text-headline-md text-primary leading-none">23</span>
          </div>
        </div>
        {/* Micro Highlights / Attendance & Today's Metric */}
        <div className="mt-space-md pt-space-md flex items-center justify-between gap-space-sm relative z-10 border-t border-outline/10 dark:border-[#3c3c3c]">
          <div className="flex items-center gap-2 bg-tertiary/10 text-tertiary px-space-md py-1.5 rounded-full">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label-md text-label-md text-tertiary">
              96% Overall Attendance
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary-container">
              local_fire_department
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              14 Day Streak
            </span>
          </div>
        </div>
      </section>

      {/* Responsive 2-Column Grid on Laptop (lg:), clean vertical stack on mobile */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-space-md">
        {/* Main Column (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Urgent Quick Notice Ticker */}
          <section>
            <Link
              href="/notices"
              className="bg-gradient-to-r from-secondary-container/20 via-surface-container-low to-surface-container-lowest dark:from-[#252526] dark:via-[#252526] dark:to-[#252526] dark:border dark:border-[#3c3c3c] p-space-sm rounded-DEFAULT flex items-center gap-space-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                    Official Date • {nextSchoolEvent?.tag || 'ALERT'}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    • {nextSchoolEvent?.date || 'Campus Roster'}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface truncate">
                  {nextSchoolEvent ? `${nextSchoolEvent.title} — ${nextSchoolEvent.description}` : 'Regular classes resume Thursday - official circular uploaded'}
                </p>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px] flex-shrink-0">
                arrow_forward_ios
              </span>
            </Link>
          </section>

          {/* Today's Schedule Live Reel Card */}
          <section>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Today's Class Stream
                </h2>
              </div>
              <Link
                href="/timetable"
                className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-0.5"
              >
                Full Timetable
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
            {/* Active Class Card Stream */}
            <div className="bg-white dark:bg-[#252526] rounded-[14px] border border-outline/10 dark:border-[#3c3c3c] p-space-md shadow-sm space-y-space-sm">
              {/* Period 1: Live / First Period */}
              {todayPeriods[0] && (
                <div
                  className={`flex items-center justify-between p-space-sm rounded-[12px] border transition-all ${
                    todayPeriods[0].isLive
                      ? 'bg-primary/5 dark:bg-[#007acc]/15 border-primary/20 dark:border-[#007acc]/40'
                      : 'bg-surface-container-low dark:bg-[#1e1e1e] border-outline/10 dark:border-[#3c3c3c]'
                  }`}
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(28,42,200,0.3)]">
                      <span className="material-symbols-outlined text-[20px]">
                        {todayPeriods[0].accent === 'tertiary' ? 'science' : 'menu_book'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap flex-shrink-0 text-[10px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-tight">
                          {todayPeriods[0].isLive ? 'Now • ' : ''}
                          {todayPeriods[0].period}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline whitespace-nowrap">
                          {todayPeriods[0].time}
                        </span>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {todayPeriods[0].subject}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {todayPeriods[0].room} • {todayPeriods[0].teacher}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/timetable"
                    className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(28,42,200,0.25)] flex items-center gap-1 flex-shrink-0 hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {todayPeriods[0].isLive ? 'videocam' : 'meeting_room'}
                    </span>
                    {todayPeriods[0].isLive ? 'Join Lab' : 'View'}
                  </Link>
                </div>
              )}
              {/* Period 2 & 3 Condensed Preview */}
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                {todayPeriods.slice(1, 3).map((p, idx) => (
                  <div
                    key={`${p.period}-${idx}`}
                    className="bg-surface-container-low dark:bg-[#1e1e1e] p-space-sm rounded-[12px] border border-outline/10 dark:border-[#3c3c3c] flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-label-sm text-label-sm text-outline">{p.time}</span>
                      <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate mt-0.5">
                        {p.subject}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {p.room} • {p.teacher}
                      </p>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary mt-2 flex items-center gap-1 font-bold">
                      {p.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* School Hub & Services Grid */}
          <section>
            <div className="flex items-center justify-between mb-space-sm">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  School Hub &amp; Services
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Essential student tools, diaries, &amp; academics
                </p>
              </div>
              <span className="whitespace-nowrap flex-shrink-0 inline-flex items-center text-[11px] font-bold tracking-tight bg-surface-container dark:bg-[#252526] dark:border dark:border-[#3c3c3c] px-2.5 py-0.5 rounded-full text-on-surface-variant">
                9 Services
              </span>
            </div>
            {/* Modular Cards Grid */}
            <div className="grid grid-cols-3 gap-space-sm sm:gap-4">
              {/* 1. Homework & Diary */}
              <Link
                href="/diary"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 bg-error text-on-error font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                  {pendingDiaryCount} Due
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(28,42,200,0.3)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">menu_book</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Homework &amp; Diary
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Assignments</span>
              </Link>
              {/* 2. Attendance Tracker */}
              <Link
                href="/attendance"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(0,80,54,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  100% Oct
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-tertiary to-tertiary-container text-on-tertiary flex items-center justify-center shadow-[0_8px_16px_rgba(0,80,54,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">event_available</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Attendance
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Logs &amp; Leave</span>
              </Link>
              {/* 3. Announcements */}
              <Link
                href="/notices"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(254,166,25,0.2)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 bg-secondary-container text-on-secondary-container font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  3 New
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-secondary-container text-on-secondary flex items-center justify-center shadow-[0_8px_16px_rgba(254,166,25,0.3)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">campaign</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Notices
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Circulars</span>
              </Link>
              {/* 4. Fees & Payment */}
              <Link
                href="/academics"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  Due Sep
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-surface-tint to-primary text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(60,74,224,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">
                    account_balance_wallet
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Fees &amp; Pay
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Receipts</span>
              </Link>
              {/* 5. Exam Marks & Results */}
              <Link
                href="/exams"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  Report Card
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-inverse-surface to-on-surface text-surface-bright flex items-center justify-center shadow-[0_8px_16px_rgba(19,27,46,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Exam Marks
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Term Trends</span>
              </Link>
              {/* 6. E-Content & Notes */}
              <Link
                href="/library"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 bg-surface-container-highest text-primary font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  12 Files
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-container to-surface-variant text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(59,73,223,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">folder_special</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  E-Content
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Study PDFs</span>
              </Link>
              {/* 7. Annual Calendar */}
              <Link
                href="/timetable"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-surface-dim to-surface-container-high text-primary flex items-center justify-center shadow-sm mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">calendar_month</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Calendar
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">
                  Events &amp; Vacations
                </span>
              </Link>
              {/* 8. Write to School / Helpdesk */}
              <Link
                href="/helpdesk"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary-fixed-dim to-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-sm mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">mark_chat_unread</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Write School
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Parent Desk</span>
              </Link>
              {/* 9. Live Class & Online Tests */}
              <Link
                href="/exams"
                className="group relative bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] dark:hover:bg-[#2d2d2d] p-space-sm rounded-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95"
              >
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-surface-tint text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(28,42,200,0.3)] mb-2 group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">laptop_chromebook</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">
                  Live Tests
                </span>
                <span className="font-label-sm text-[10px] text-outline mt-0.5">Exam Portal</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Side Column on Laptop (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg mt-space-lg lg:mt-0">
          {/* Quick Progress & Performance Snapshot Banner */}
          <section className="bg-white dark:bg-[#252526] rounded-[14px] border border-outline/10 dark:border-[#3c3c3c] p-space-md shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                {/* Circular Progress Ring SVG */}
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container dark:text-[#3c3c3c]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  ></path>
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  ></path>
                </svg>
                <span className="absolute font-label-md text-label-md font-extrabold text-on-surface">
                  88%
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                  Semester Credit Goal
                </p>
                <p className="font-body-sm text-body-sm text-outline truncate">
                  On track for Honor Roll (Term 1)
                </p>
              </div>
            </div>
            <Link
              href="/exams"
              className="w-9 h-9 rounded-full bg-surface-container dark:bg-[#1e1e1e] hover:bg-surface-container-high dark:hover:bg-[#2d2d2d] flex items-center justify-center text-primary flex-shrink-0 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </Link>
          </section>

          {/* Quick Academic Hub Shortcuts (Desktop View Enhancement) */}
          <section className="bg-white dark:bg-[#252526] rounded-[14px] border border-outline/10 dark:border-[#3c3c3c] p-space-md shadow-sm hidden lg:flex flex-col gap-3">
            <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/bus"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low dark:bg-[#1e1e1e] hover:bg-surface-container dark:hover:bg-[#2d2d2d] dark:border dark:border-[#3c3c3c] transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">directions_bus</span>
                <span className="text-[12px] font-semibold text-on-surface">Bus Track</span>
              </Link>
              <Link
                href="/canteen"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low dark:bg-[#1e1e1e] hover:bg-surface-container dark:hover:bg-[#2d2d2d] dark:border dark:border-[#3c3c3c] transition-colors"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">restaurant</span>
                <span className="text-[12px] font-semibold text-on-surface">Canteen</span>
              </Link>
              <Link
                href="/library"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low dark:bg-[#1e1e1e] hover:bg-surface-container dark:hover:bg-[#2d2d2d] dark:border dark:border-[#3c3c3c] transition-colors"
              >
                <span className="material-symbols-outlined text-tertiary text-[20px]">local_library</span>
                <span className="text-[12px] font-semibold text-on-surface">E-Library</span>
              </Link>
              <Link
                href="/health"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low dark:bg-[#1e1e1e] hover:bg-surface-container dark:hover:bg-[#2d2d2d] dark:border dark:border-[#3c3c3c] transition-colors"
              >
                <span className="material-symbols-outlined text-error text-[20px]">local_hospital</span>
                <span className="text-[12px] font-semibold text-on-surface">Clinic</span>
              </Link>
            </div>
          </section>

          {/* Parent Help & Quick Desk Link Pill */}
          <div className="text-center p-4 rounded-xl bg-surface-container-low dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c]">
            <p className="font-body-sm text-body-sm text-outline">
              Need guardian assistance?
              <Link href="/helpdesk" className="text-primary font-bold hover:underline ml-1">
                Parent Helpline
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
