'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function DiaryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [student, setStudent] = useState({
    name: 'Student',
    section: 'Sec E',
    details: 'Class 12-E • Roll No. 20',
    initials: 'ST',
  });

  useEffect(() => {
    const s = getSession();
    if (!s?.student && !s?.name) {
      window.location.replace('/chooser');
      return;
    }
    const name = s?.student?.displayName || s?.student?.name || s?.name || 'Student';
    const grade = s?.student?.grade || '12';
    const section = s?.student?.section || 'E';
    const roll = s?.student?.rollNo || '20';
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
  }, []);

  return (
    <PortalShell title="Homework & Diary" activePath="diary">
      <div className="flex flex-col w-full relative gap-space-md">
        {/* Ambient Atmospheric Backdrops */}
        <div className="absolute -top-10 -left-12 w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-72 -right-16 w-72 h-72 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>

        {/* Student Profile Strip */}
        <section>
          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl p-space-sm px-space-md shadow-[0_8px_24px_-6px_rgba(59,73,223,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold shadow-inner">
                  {student.initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-tertiary-fixed-dim rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">{student.name}</span>
                  <span className="bg-surface-container-high text-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full">
                    {student.section}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {student.details}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-secondary text-[16px]">military_tech</span>
              <span className="font-label-sm text-label-sm text-on-secondary-container">Term 1</span>
            </div>
          </div>
        </section>

        {/* Summary Banner Card */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#1d2cc9] text-on-primary p-space-md shadow-[0_14px_30px_-8px_rgba(28,42,200,0.38)]">
            <svg
              className="absolute -right-6 -bottom-8 w-44 h-44 text-white/10 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" opacity="0.3" r="80"></circle>
              <path
                d="M140,20 C180,60 190,130 140,170 C90,210 20,160 30,100 C40,40 100,-20 140,20 Z"
                opacity="0.2"
              ></path>
            </svg>
            <div className="relative z-10 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="p-1.5 rounded-xl bg-white/15 backdrop-blur-md">
                    <span className="material-symbols-outlined text-on-primary text-[20px]">auto_stories</span>
                  </span>
                  <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-primary-container">
                    Academic Planner
                  </span>
                </div>
                <span className="font-label-sm text-label-sm bg-white/20 px-2.5 py-0.5 rounded-full text-on-primary">
                  2 Due Soon
                </span>
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary">
                  Student Diary &amp; Tasks
                </h1>
                <p className="font-body-sm text-body-sm text-on-primary-container mt-0.5">
                  Manage daily prep, submit digital journals &amp; lab records
                </p>
              </div>
              {/* Filter Pills */}
              <div className="flex items-center gap-space-xs overflow-x-auto pt-space-xs no-scrollbar">
                <button
                  onClick={() => setActiveFilter('All')}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1 ${
                    activeFilter === 'All' ? 'bg-white text-primary shadow-sm' : 'bg-white/15 text-white'
                  }`}
                >
                  <span>All Subjects</span>
                </button>
                <button
                  onClick={() => setActiveFilter('Pending')}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5 ${
                    activeFilter === 'Pending' ? 'bg-white text-primary shadow-sm' : 'bg-white/15 text-white'
                  }`}
                >
                  <span>Pending</span>
                  <span className="w-4 h-4 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                </button>
                <button
                  onClick={() => setActiveFilter('Submitted')}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5 ${
                    activeFilter === 'Submitted' ? 'bg-white text-primary shadow-sm' : 'bg-white/15 text-white'
                  }`}
                >
                  <span>Submitted</span>
                  <span className="w-4 h-4 rounded-full bg-white/30 text-white text-[10px] font-bold flex items-center justify-center">
                    5
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Coursework Cards Grid: 2 columns on laptop (lg:), single column on phone */}
        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between pt-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">Assigned Coursework</span>
              <span className="bg-surface-container-high font-label-sm text-label-sm text-primary px-2 py-0.5 rounded-full font-bold">
                3 Tasks
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-outline">Sorted by deadline</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
            {/* CARD 1: Mathematics II */}
            <article className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_12px_28px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between">
              <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-error rounded-r-full"></div>
              <div>
                <div className="flex items-start justify-between gap-space-sm pl-2">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-error-container/30 flex items-center justify-center text-error flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">calculate</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold">
                          Mathematics II
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="font-label-sm text-label-sm text-outline">Ex 7.3</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                        Calculus Problem Set 4
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 font-semibold shadow-sm">
                    Due Today
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md mt-space-sm py-1.5 px-space-sm rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm pl-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">school</span>
                    <span>Mrs. S. Roy</span>
                  </div>
                  <div className="flex items-center gap-1 text-error font-medium">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Due: 11:59 PM Tonight</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed pl-2">
                  Complete questions 1 to 14 from Exercise 7.3 (Integration by Partial Fractions). Upload
                  clean handwritten solutions as a PDF.
                </p>
              </div>
              <div className="mt-space-md flex items-center gap-space-sm pl-2">
                <button className="flex-1 min-h-[44px] bg-primary text-on-primary rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs shadow-sm hover:bg-primary/90 transition-all">
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>Submit Work</span>
                </button>
              </div>
            </article>

            {/* CARD 2: Physics Practical Lab Manual */}
            <article className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_12px_28px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between">
              <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-tertiary rounded-r-full"></div>
              <div>
                <div className="flex items-start justify-between gap-space-sm pl-2">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">science</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-bold">
                          Physics Lab
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="font-label-sm text-label-sm text-outline">Exp #3</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                        Optics &amp; Focal Length Verification
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-tertiary/15 text-tertiary px-2 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 font-semibold shadow-sm">
                    Submitted
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed pl-2">
                  Plot u-v graph for convex lens and calculate focal length error bounds. Verified by Dr.
                  Aris Thorne.
                </p>
                <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-on-surface truncate">
                    Ray_Diagram_Shaw_12E.pdf
                  </span>
                  <span className="text-[11px] font-bold text-tertiary">Verified</span>
                </div>
              </div>
            </article>

            {/* CARD 3: Organic Chemistry */}
            <article className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_12px_28px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between lg:col-span-2">
              <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-secondary-container rounded-r-full"></div>
              <div>
                <div className="flex items-start justify-between gap-space-sm pl-2">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">biotech</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                          Organic Chemistry
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="font-label-sm text-label-sm text-outline">Unit 4</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                        Reaction Mechanism Notes
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 font-medium">
                    Due Next Monday
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed pl-2">
                  Prepare comparative summary on SN1 vs SN2 nucleophilic substitution kinetics. Include
                  energy coordinate diagrams and stereochemical inversion examples.
                </p>
              </div>
              <div className="mt-space-md flex items-center gap-space-sm pl-2">
                <button className="flex-1 min-h-[44px] bg-surface-container-low hover:bg-surface-container text-primary rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs transition-colors">
                  <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                  <span>Download Assignment Sheet</span>
                </button>
              </div>
            </article>
          </div>

          {/* Teacher Remark Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-surface-container to-surface-container-high p-space-md flex items-start gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Class Teacher's Remark
                </span>
                <span className="font-label-sm text-label-sm text-outline">Yesterday</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                "Parents signature required on the quarterly progress report by Friday. Chemistry practical
                files must be spiral bound."
              </p>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
