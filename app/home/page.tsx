'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function HomePage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Home</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface"><div className="flex flex-col w-full px-margin pb-space-lg">
      {/*Subtle Atmospheric Orbs*/}
      <div className="relative w-full">
      <div className="absolute -top-12 -left-10 w-48 h-48 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-28 -right-10 w-44 h-44 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>
      </div>
      {/*Student Welcome Banner Card (Elevated Frosted Hero Slab)*/}
      <section className="relative mt-space-sm bg-gradient-to-br from-white/95 via-surface-container-lowest/90 to-surface-container-low/80 backdrop-blur-xl rounded-lg p-space-lg shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] overflow-hidden">
      {/*Ambient Accent Glow*/}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex items-start justify-between gap-space-md relative z-10">
      <div className="flex items-center gap-space-md min-w-0">
      {/*Student Avatar with Verified Ring*/}
      <div className="relative flex-shrink-0">
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_6px_16px_rgba(28,42,200,0.18)] bg-surface-container-highest">
      <img alt="Rajen Shaw Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2HL6mlKQFX_TInOT64dMFoflC4pOZFhVO5vC5KUg1zG9aHWIOAG0BaM1MKOq5v0-qHFzN-DbWra0R-q7csvdmGY2a4mn1n3BTf4p5TiCeBP5PLiuuzrRqvOFPDb4JC8ND8nLDArYAjww0YpZMpS-hcdGZOaAEEZc5c145anZkYFBjtzMVFHzb5MK3JXtUSrInlrm8-i6kElfgmG6pQgJJv6m10BZjJ9goEvKG0Mr6qs3VDu4p0sD1Bw"/>
      </div>
      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center text-[12px] shadow-sm">
      <span className="material-symbols-outlined text-[13px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
      </span>
      </div>
      {/*Greeting & Credentials*/}
      <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-space-xs">
      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Good Morning</span>
      <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-tertiary"></span>
      </div>
      <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface truncate">Rajen Shaw</h1>
      <div className="flex items-center gap-space-xs flex-wrap mt-0.5">
      <span className="font-label-md text-label-md bg-surface-container px-2.5 py-0.5 rounded-full text-primary font-bold">Class 12 - E</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Roll No. 24</span>
      </div>
      </div>
      </div>
      {/*Quick Date Dial*/}
      <div className="hidden sm:flex flex-col items-center bg-surface-container-low px-3 py-2 rounded-DEFAULT text-center shadow-sm">
      <span className="font-label-sm text-label-sm text-outline uppercase">Sep</span>
      <span className="font-headline-md text-headline-md text-primary leading-none">23</span>
      </div>
      </div>
      {/*Micro Highlights / Attendance & Today's Metric*/}
      <div className="mt-space-md pt-space-md flex items-center justify-between gap-space-sm relative z-10">
      <div className="flex items-center gap-2 bg-tertiary/10 text-tertiary px-space-md py-1.5 rounded-full">
      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
      <span className="font-label-md text-label-md text-tertiary">96% Overall Attendance</span>
      </div>
      <div className="flex items-center gap-1.5 text-on-surface-variant">
      <span className="material-symbols-outlined text-[16px] text-secondary-container">local_fire_department</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">14 Day Streak</span>
      </div>
      </div>
      </section>
      {/*Urgent Quick Notice Ticker*/}
      <section className="mt-space-md">
      <div className="bg-gradient-to-r from-secondary-container/20 via-surface-container-low to-surface-container-lowest p-space-sm rounded-DEFAULT flex items-center gap-space-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="material-symbols-outlined text-[18px]">campaign</span>
      </div>
      <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
      <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">Campus Alert</span>
      <span className="font-label-sm text-label-sm text-outline">• 25m ago</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface truncate">Regular classes resume Thursday, 24th Sep - 1 new circular uploaded</p>
      </div>
      <span className="material-symbols-outlined text-outline-variant text-[20px] flex-shrink-0">arrow_forward_ios</span>
      </div>
      </section>
      {/*Today's Schedule Live Reel Card*/}
      <section className="mt-space-lg">
      <div className="flex items-center justify-between mb-space-sm">
      <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Today's Class Stream</h2>
      </div>
      <button className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-0.5">
      Full Timetable
      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
      </div>
      {/*Active Class Card Stream*/}
      <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-[0_8px_20px_rgba(0,0,0,0.03)] space-y-space-sm">
      {/*Period 1: Live Now*/}
      <div className="flex items-center justify-between p-space-sm rounded-DEFAULT bg-primary/5 transition-all">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(28,42,200,0.3)]">
      <span className="material-symbols-outlined text-[20px]">science</span>
      </div>
      <div className="min-w-0">
      <div className="flex items-center gap-2">
      <span className="font-label-sm text-label-sm uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">Now • Period 1</span>
      <span className="font-label-sm text-label-sm text-outline">08:30 - 09:30 AM</span>
      </div>
      <p className="font-headline-sm text-headline-sm text-on-surface truncate">Physics Lab (Optics &amp; Laser)</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Lab 3 • Dr. Aris Thorne</p>
      </div>
      </div>
      <button className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(28,42,200,0.25)] flex items-center gap-1 flex-shrink-0">
      <span className="material-symbols-outlined text-[16px]">meeting_room</span>
      Join Lab
      </button>
      </div>
      {/*Period 2 & 3 Condensed Preview*/}
      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
      <div className="bg-surface-container-low p-space-sm rounded-DEFAULT flex flex-col justify-between">
      <div>
      <span className="font-label-sm text-label-sm text-outline">09:40 - 10:35 AM</span>
      <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate mt-0.5">Mathematics II</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Calculus • Room 402</p>
      </div>
      <span className="font-label-sm text-label-sm text-primary mt-2 flex items-center gap-1 font-bold">Period 2</span>
      </div>
      <div className="bg-surface-container-low p-space-sm rounded-DEFAULT flex flex-col justify-between">
      <div>
      <span className="font-label-sm text-label-sm text-outline">10:50 - 11:45 AM</span>
      <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate mt-0.5">Chemistry Organic</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Seminar Hall B</p>
      </div>
      <span className="font-label-sm text-label-sm text-outline mt-2 flex items-center gap-1 font-bold">Period 3</span>
      </div>
      </div>
      </div>
      </section>
      {/*School Hub & Services Grid (Replacing Outdated 9-Box Grid)*/}
      <section className="mt-space-xl">
      <div className="flex items-center justify-between mb-space-sm">
      <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">School Hub &amp; Services</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Essential student tools, diaries, &amp; academics</p>
      </div>
      <span className="font-label-sm text-label-sm bg-surface-container px-2 py-1 rounded-full text-on-surface-variant">9 Services</span>
      </div>
      {/*3D Tactile Modular Cards Grid*/}
      <div className="grid grid-cols-3 gap-space-sm">
      {/*1. Homework & Diary*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 bg-error text-on-error font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">2 Due</span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(28,42,200,0.3)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">menu_book</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Homework &amp; Diary</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Assignments</span>
      </div>
      {/*2. Attendance Tracker*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(0,80,54,0.18)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">100% Oct</span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tertiary to-tertiary-container text-on-tertiary flex items-center justify-center shadow-[0_8px_16px_rgba(0,80,54,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">event_available</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Attendance</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Logs &amp; Leave</span>
      </div>
      {/*3. Announcements*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(254,166,25,0.2)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 bg-secondary-container text-on-secondary-container font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">3 New</span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary to-secondary-container text-on-secondary flex items-center justify-center shadow-[0_8px_16px_rgba(254,166,25,0.3)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">campaign</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Notices</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Circulars</span>
      </div>
      {/*4. Fees & Payment*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">Due Sep</span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-surface-tint to-primary text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(60,74,224,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Fees &amp; Pay</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Receipts</span>
      </div>
      {/*5. Exam Marks & Results*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">Report Card</span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-inverse-surface to-on-surface text-surface-bright flex items-center justify-center shadow-[0_8px_16px_rgba(19,27,46,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Exam Marks</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Term Trends</span>
      </div>
      {/*6. E-Content & Notes*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 bg-surface-container-highest text-primary font-label-sm text-[9px] px-1.5 py-0.5 rounded-full font-bold">12 Files</span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-container to-surface-variant text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(59,73,223,0.25)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">folder_special</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">E-Content</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Study PDFs</span>
      </div>
      {/*7. Annual Calendar*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-surface-dim to-surface-container-high text-primary flex items-center justify-center shadow-sm mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">calendar_month</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Calendar</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Events &amp; Vacations</span>
      </div>
      {/*8. Write to School / Helpdesk*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary-fixed-dim to-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-sm mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">mark_chat_unread</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Write School</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Parent Desk</span>
      </div>
      {/*9. Live Class & Online Tests*/}
      <div className="group relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-sm rounded-lg flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(59,73,223,0.18)] transition-all cursor-pointer transform active:scale-95">
      <span className="absolute top-2 right-2 flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
      </span>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-surface-tint text-on-primary flex items-center justify-center shadow-[0_8px_16px_rgba(28,42,200,0.3)] mb-2 group-hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-[26px]">laptop_chromebook</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface leading-snug font-bold">Live Tests</span>
      <span className="font-label-sm text-[10px] text-outline mt-0.5">Exam Portal</span>
      </div>
      </div>
      </section>
      {/*Quick Progress & Performance Snapshot Banner*/}
      <section className="mt-space-lg bg-surface-container-lowest rounded-lg p-space-md shadow-[0_8px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
      {/*Circular Progress Ring SVG*/}
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
      <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
      <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="3.5"></path>
      </svg>
      <span className="absolute font-label-md text-label-md font-extrabold text-on-surface">88%</span>
      </div>
      <div className="min-w-0">
      <p className="font-label-lg text-label-lg text-on-surface font-bold truncate">Semester Credit Goal</p>
      <p className="font-body-sm text-body-sm text-outline truncate">On track for Honor Roll (Term 1)</p>
      </div>
      </div>
      <button className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0 transition-colors">
      <span className="material-symbols-outlined text-[20px]">trending_up</span>
      </button>
      </section>
      {/*Parent Help & Quick Desk Link Pill*/}
      <div className="mt-space-md text-center">
      <p className="font-body-sm text-body-sm text-outline">
      Need guardian assistance?
      <a className="text-primary font-bold hover:underline ml-1" href="#">Call Principal Helpline</a>
      </p>
      </div>
      </div>
      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between"><Link aria-current="page" className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 text-on-surface-variant" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
