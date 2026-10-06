'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function DiaryPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Home</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface"><div className="flex flex-col w-full relative">
      {/*Ambient Atmospheric Backdrops*/}
      <div className="absolute -top-10 -left-12 w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-72 -right-16 w-72 h-72 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
      {/*Student Profile Strip (Tactile Glass Chip)*/}
      <section className="px-margin pt-space-sm pb-space-xs">
      <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl p-space-sm px-space-md shadow-[0_8px_24px_-6px_rgba(59,73,223,0.08)] flex items-center justify-between">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="relative">
      <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold shadow-inner">
      RS
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-tertiary-fixed-dim rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
      </span>
      </div>
      <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-space-xs">
      <span className="font-headline-sm text-headline-sm text-on-surface truncate">Rajen Shaw</span>
      <span className="bg-surface-container-high text-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full">Sec E</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Class 12-E • Roll No. 24</p>
      </div>
      </div>
      <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-full">
      <span className="material-symbols-outlined text-secondary text-[16px]">military_tech</span>
      <span className="font-label-sm text-label-sm text-on-secondary-container">Term 1</span>
      </div>
      </div>
      </section>
      {/*Summary Banner Card with Ambient Luster*/}
      <section className="px-margin pt-space-xs pb-space-sm">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#1d2cc9] text-on-primary p-space-md shadow-[0_14px_30px_-8px_rgba(28,42,200,0.38)]">
      {/*Decorative Organic Geometry SVG*/}
      <svg className="absolute -right-6 -bottom-8 w-44 h-44 text-white/10 pointer-events-none" fill="currentColor" viewBox="0 0 200 200">
      <circle cx="100" cy="100" opacity="0.3" r="80"></circle>
      <path d="M140,20 C180,60 190,130 140,170 C90,210 20,160 30,100 C40,40 100,-20 140,20 Z" opacity="0.2"></path>
      </svg>
      <div className="relative z-10 flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-space-xs">
      <span className="p-1.5 rounded-xl bg-white/15 backdrop-blur-md">
      <span className="material-symbols-outlined text-on-primary text-[20px]">auto_stories</span>
      </span>
      <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-primary-container">Academic Planner</span>
      </div>
      <span className="font-label-sm text-label-sm bg-white/20 px-2.5 py-0.5 rounded-full text-on-primary">
      2 Due Soon
      </span>
      </div>
      <div>
      <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary">Student Diary &amp; Tasks</h1>
      <p className="font-body-sm text-body-sm text-on-primary-container mt-0.5">Manage daily prep, submit digital journals &amp; lab records</p>
      </div>
      {/*Filter Pill Carousel*/}
      <div className="flex items-center gap-space-xs overflow-x-auto pt-space-xs no-scrollbar">
      <button className="filter-pill active px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-white text-primary shadow-sm whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1">
      <span>All Subjects</span>
      </button>
      <button className="filter-pill px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-white/15 text-white backdrop-blur-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5">
      <span>Pending</span>
      <span className="w-4 h-4 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center">2</span>
      </button>
      <button className="filter-pill px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-white/15 text-white backdrop-blur-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5">
      <span>Submitted</span>
      <span className="w-4 h-4 rounded-full bg-white/30 text-white text-[10px] font-bold flex items-center justify-center">5</span>
      </button>
      <button className="filter-pill px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-white/15 text-white backdrop-blur-md whitespace-nowrap transition-transform active:scale-95">
      <span>Evaluated</span>
      </button>
      </div>
      </div>
      </div>
      </section>
      {/*Interactive Week Schedule Rail*/}
      <section className="px-margin py-space-xs">
      <div className="flex items-center justify-between mb-space-xs">
      <div className="flex items-center gap-1.5">
      <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
      <span className="font-label-lg text-label-lg text-on-surface">September 2024</span>
      </div>
      <button className="text-primary font-label-md text-label-md flex items-center gap-0.5 hover:underline">
      <span>Full Month</span>
      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
      </div>
      {/*Week Slider Days*/}
      <div className="grid grid-cols-6 gap-2 bg-surface-container-low p-2 rounded-2xl shadow-inner">
      {/*Mon 21*/}
      <div className="day-chip flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer bg-transparent hover:bg-surface-container">
      <span className="font-label-sm text-label-sm text-outline">MON</span>
      <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">21</span>
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1 opacity-70"></span>
      </div>
      {/*Tue 22*/}
      <div className="day-chip flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer bg-transparent hover:bg-surface-container">
      <span className="font-label-sm text-label-sm text-outline">TUE</span>
      <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">22</span>
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1 opacity-70"></span>
      </div>
      {/*Wed 23*/}
      <div className="day-chip flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer bg-transparent hover:bg-surface-container">
      <span className="font-label-sm text-label-sm text-outline">WED</span>
      <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">23</span>
      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container mt-1"></span>
      </div>
      {/*Thu 24 (Active Day)*/}
      <div className="day-chip active flex flex-col items-center justify-center py-2 rounded-xl bg-primary text-on-primary shadow-[0_6px_16px_-2px_rgba(28,42,200,0.35)] transform scale-[1.03]">
      <span className="font-label-sm text-label-sm text-on-primary-container font-semibold">THU</span>
      <span className="font-headline-sm text-headline-sm text-on-primary font-bold mt-0.5">24</span>
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed mt-1 animate-pulse"></span>
      </div>
      {/*Fri 25*/}
      <div className="day-chip flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer bg-transparent hover:bg-surface-container">
      <span className="font-label-sm text-label-sm text-outline">FRI</span>
      <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">25</span>
      <span className="w-1.5 h-1.5 rounded-full bg-error mt-1 opacity-80"></span>
      </div>
      {/*Sat 26*/}
      <div className="day-chip flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer bg-transparent hover:bg-surface-container">
      <span className="font-label-sm text-label-sm text-outline">SAT</span>
      <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">26</span>
      <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1"></span>
      </div>
      </div>
      </section>
      {/*Homework Assignment Cards Stack*/}
      <section className="px-margin pt-space-sm flex flex-col gap-space-md">
      {/*SECTION SUBTITLE & COUNTER*/}
      <div className="flex items-center justify-between pt-space-xs">
      <div className="flex items-center gap-space-xs">
      <span className="font-headline-sm text-headline-sm text-on-surface">Assigned Coursework</span>
      <span className="bg-surface-container-high font-label-sm text-label-sm text-primary px-2 py-0.5 rounded-full font-bold">3 Tasks</span>
      </div>
      <span className="font-body-sm text-body-sm text-outline">Sorted by deadline</span>
      </div>
      {/*CARD 1: Mathematics II (Urgent & In Progress)*/}
      <article className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_12px_28px_-6px_rgba(15,23,42,0.07),0_4px_12px_-2px_rgba(59,73,223,0.05)] transition-all hover:shadow-[0_16px_32px_-6px_rgba(59,73,223,0.12)]">
      {/*Soft ambient highlight indicator stripe on the left edge*/}
      <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-error rounded-r-full"></div>
      {/*Top Row: Course + Badges*/}
      <div className="flex items-start justify-between gap-space-sm">
      <div className="flex items-center gap-space-sm">
      <div className="w-10 h-10 rounded-xl bg-error-container/30 flex items-center justify-center text-error flex-shrink-0">
      <span className="material-symbols-outlined text-[22px]">calculate</span>
      </div>
      <div>
      <div className="flex items-center gap-space-xs">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold">Mathematics II</span>
      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
      <span className="font-label-sm text-label-sm text-outline">Ex 7.3</span>
      </div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Calculus Problem Set 4</h2>
      </div>
      </div>
      {/*Priority / Urgency Badge*/}
      <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 font-semibold shadow-sm">
      <span className="material-symbols-outlined text-[13px]">alarm</span>
      <span>Urgent</span>
      </span>
      </div>
      {/*Teacher and Due Date Ribbon*/}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md mt-space-sm py-1.5 px-space-sm rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
      <div className="flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px] text-outline">school</span>
      <span>Dr. Aris Thorne</span>
      </div>
      <div className="flex items-center gap-1 text-error font-semibold">
      <span className="material-symbols-outlined text-[16px]">schedule</span>
      <span>Due Tomorrow, 11:59 PM</span>
      </div>
      </div>
      {/*Assignment Description*/}
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
      Complete exercise 7.3 problems 1-15 on differential equations. Attach PDF scan of handwritten notebook solutions showing all substitution steps clearly.
      </p>
      {/*Interactive Progress Ring & Status Slab*/}
      <div className="mt-space-md pt-space-xs flex items-center justify-between p-2.5 rounded-xl bg-surface-container">
      <div className="flex items-center gap-space-sm">
      {/*Circular Progress Ring SVG*/}
      <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
      <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
      <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
      <path className="text-primary stroke-round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="65, 100" strokeWidth="3.5"></path>
      </svg>
      <span className="absolute font-label-sm text-label-sm text-primary font-bold">65%</span>
      </div>
      <div>
      <span className="font-label-md text-label-md text-on-surface font-semibold block">Draft In Progress</span>
      <span className="font-body-sm text-body-sm text-outline">1 of 2 pages scanned</span>
      </div>
      </div>
      <a className="font-label-md text-label-md text-primary flex items-center gap-1 hover:underline" href="#">
      <span className="material-symbols-outlined text-[17px]">download</span>
      <span>Worksheet (2.4 MB)</span>
      </a>
      </div>
      {/*Action Button Area*/}
      <div className="mt-space-md flex items-center gap-space-sm">
      <button className="flex-1 min-h-[44px] bg-primary text-on-primary rounded-full font-label-lg text-label-lg font-bold shadow-[0_8px_20px_-4px_rgba(59,73,223,0.4)] flex items-center justify-center gap-space-xs transition-all active:scale-[0.98] hover:bg-primary-container">
      <span className="material-symbols-outlined text-[18px]">upload_file</span>
      <span>Attach Work / PDF</span>
      </button>
      <button className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:text-primary transition-colors flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
      </button>
      </div>
      </article>
      {/*CARD 2: Physics Lab (Completed & Uploaded)*/}
      <article className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_12px_28px_-6px_rgba(15,23,42,0.07),0_4px_12px_-2px_rgba(59,73,223,0.05)]">
      {/*Soft ambient highlight indicator stripe on the left edge*/}
      <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-tertiary-container rounded-r-full"></div>
      {/*Top Row: Course + Status Badge*/}
      <div className="flex items-start justify-between gap-space-sm">
      <div className="flex items-center gap-space-sm">
      <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary flex-shrink-0">
      <span className="material-symbols-outlined text-[22px]">science</span>
      </div>
      <div>
      <div className="flex items-center gap-space-xs">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-bold">Physics Lab</span>
      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
      <span className="font-label-sm text-label-sm text-outline">Practical #08</span>
      </div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Optics Experiment Report</h2>
      </div>
      </div>
      <span className="inline-flex items-center gap-1 bg-tertiary-fixed/50 text-tertiary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 font-bold">
      <span className="material-symbols-outlined text-[13px]">check_circle</span>
      <span>Submitted</span>
      </span>
      </div>
      {/*Teacher and Due Date Ribbon*/}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md mt-space-sm py-1.5 px-space-sm rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
      <div className="flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px] text-outline">school</span>
      <span>Prof. Mukherjee</span>
      </div>
      <div className="flex items-center gap-1 text-on-surface-variant">
      <span className="material-symbols-outlined text-[16px]">event_available</span>
      <span>Due: Friday, 26 Sep</span>
      </div>
      </div>
      {/*Assignment Description*/}
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
      Ray diagram observations from Tuesday lab session. Submit lab manual graphs depicting angle of minimum deviation for prism index calculations.
      </p>
      {/*Uploaded Submission Pill (Tactile Glass Chip)*/}
      <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="w-8 h-8 rounded-lg bg-tertiary-fixed/40 text-tertiary flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[18px]">description</span>
      </div>
      <div className="flex flex-col min-w-0">
      <span className="font-label-md text-label-md text-on-surface truncate">Ray_Diagram_Shaw_12E.pdf</span>
      <span className="font-body-sm text-body-sm text-tertiary font-semibold flex items-center gap-1">
      <span className="material-symbols-outlined text-[12px]">done_all</span>
      Uploaded Sep 23, 4:15 PM
      </span>
      </div>
      </div>
      <button className="font-label-md text-label-md text-primary font-bold px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors">
      View
      </button>
      </div>
      </article>
      {/*CARD 3: Organic Chemistry (Not Started)*/}
      <article className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_12px_28px_-6px_rgba(15,23,42,0.07),0_4px_12px_-2px_rgba(59,73,223,0.05)]">
      {/*Soft ambient highlight indicator stripe on the left edge*/}
      <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-secondary-container rounded-r-full"></div>
      {/*Top Row: Course + Status Badge*/}
      <div className="flex items-start justify-between gap-space-sm">
      <div className="flex items-center gap-space-sm">
      <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary flex-shrink-0">
      <span className="material-symbols-outlined text-[22px]">biotech</span>
      </div>
      <div>
      <div className="flex items-center gap-space-xs">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Organic Chemistry</span>
      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
      <span className="font-label-sm text-label-sm text-outline">Unit 4</span>
      </div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Reaction Mechanism Notes</h2>
      </div>
      </div>
      <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 font-medium">
      <span className="w-2 h-2 rounded-full bg-outline"></span>
      <span>Not Started</span>
      </span>
      </div>
      {/*Teacher and Due Date Ribbon*/}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md mt-space-sm py-1.5 px-space-sm rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
      <div className="flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px] text-outline">school</span>
      <span>Dr. Roy</span>
      </div>
      <div className="flex items-center gap-1 text-on-surface-variant font-medium">
      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
      <span>Due: Next Monday (29 Sep)</span>
      </div>
      </div>
      {/*Assignment Description*/}
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
      Prepare comparative summary on SN1 vs SN2 nucleophilic substitution kinetics. Include energy coordinate diagrams and stereochemical inversion examples.
      </p>
      {/*Action Button Area*/}
      <div className="mt-space-md flex items-center gap-space-sm">
      <button className="flex-1 min-h-[44px] bg-surface-container-low hover:bg-surface-container text-primary rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs transition-colors">
      <span className="material-symbols-outlined text-[18px]">cloud_download</span>
      <span>Download Assignment Sheet</span>
      </button>
      <button className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:text-primary transition-colors flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      </div>
      </article>
      {/*Teacher Remark / Diary Memo Widget*/}
      <div className="rounded-2xl bg-gradient-to-r from-surface-container to-surface-container-high p-space-md flex items-start gap-space-sm">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
      </div>
      <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md font-bold text-on-surface">Class Teacher's Remark</span>
      <span className="font-label-sm text-label-sm text-outline">Yesterday</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
      "Parents signature required on the quarterly progress report by Friday. Chemistry practical files must be spiral bound."
      </p>
      </div>
      </div>
      </section>
      {/*Floating Sticky Action Button (New Diary Note / Reminder)*/}
      <div className="sticky bottom-6 right-margin self-end z-30 mr-margin mt-space-md">
      <button className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-full font-label-lg text-label-lg font-bold shadow-[0_12px_28px_-4px_rgba(28,42,200,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(28,42,200,0.6)] hover:scale-[1.02] active:scale-95 transition-all">
      <span className="material-symbols-outlined text-[20px]">add</span>
      <span>Add Note / Reminder</span>
      </button>
      </div>
      </div>
      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between"><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
