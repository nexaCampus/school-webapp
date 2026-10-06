'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function NoticesPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:1024px)]:top-7"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Home</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface"><div className="flex flex-col w-full relative">
      {/*Ambient Atmospheric Backdrops (Non-blocking design system glow)*/}
      <div className="absolute -top-12 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-80 -right-16 w-72 h-72 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
      {/*Student Context Bar (Subtle & High Identity)*/}
      <div className="px-margin pt-space-xs pb-space-sm">
      <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-xs rounded-full shadow-sm">
      <div className="flex items-center gap-space-xs min-w-0">
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-sm text-[10px]">
      RS
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
      <span className="font-label-md text-label-md text-on-surface truncate">Rajen Shaw</span>
      <span className="text-outline text-label-sm">•</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Class 12-E</span>
      <span className="text-outline text-label-sm">•</span>
      <span className="font-label-sm text-label-sm text-primary font-bold">Roll #24</span>
      </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
      <span className="inline-flex w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
      <span className="font-label-sm text-label-sm text-tertiary font-bold tracking-tight">Active Sync</span>
      </div>
      </div>
      </div>
      {/*Hero Broadcast Announcement Card*/}
      <div className="px-margin mt-space-xs">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-container via-primary to-inverse-surface text-on-primary p-space-lg shadow-[0_12px_28px_-6px_rgba(28,42,200,0.3)]">
      {/*Background subtle decorative watermark shape*/}
      <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 p-space-md opacity-10">
      <span className="material-symbols-outlined text-[96px]">campaign</span>
      </div>
      {/*Top Row Badges & Audio Action*/}
      <div className="relative z-10 flex items-center justify-between gap-space-sm mb-space-sm">
      <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-sm">
      <span className="material-symbols-outlined text-[14px]">priority_high</span>
      URGENT BROADCAST
      </div>
      <button aria-label="Listen to official audio circular" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-space-sm py-1 rounded-full text-on-primary transition-all active:scale-95 shadow-sm" id="ttsButton">
      <span className="material-symbols-outlined text-[16px]" id="ttsIcon">volume_up</span>
      <span className="font-label-sm text-label-sm" id="ttsLabel">Audio Assist</span>
      </button>
      </div>
      {/*Broadcast Content*/}
      <div className="relative z-10">
      <h2 className="font-headline-md text-headline-md text-on-primary tracking-tight leading-snug">
      Resumption of Regular Classes &amp; Annual Sports Day Registration
      </h2>
      <div className="flex items-center gap-1.5 mt-space-xs font-body-sm text-body-sm text-on-primary-container">
      <span className="material-symbols-outlined text-[14px]">verified</span>
      <span>Issued today, 10:30 AM • Office of the Principal</span>
      </div>
      {/*Collapsible text accordion*/}
      <div className="mt-space-md">
      <p className="font-body-md text-body-md text-white/90 line-clamp-2 transition-all duration-300" id="heroSnippet">
      All secondary &amp; senior secondary cohorts (Grades 9 to 12) shall resume in-person curriculum schedules starting this Wednesday. Preliminary trials for the Inter-House Track &amp; Field meet begin simultaneously at the Main Stadium Grounds.
      </p>
      <div className="mt-space-sm flex items-center justify-between pt-space-xs">
      <button className="inline-flex items-center gap-1 font-label-md text-label-md text-tertiary-fixed hover:text-white transition-colors" id="toggleHeroBtn">
      <span id="toggleHeroText">Read Full Circular</span>
      <span className="material-symbols-outlined text-[16px] transition-transform" id="toggleHeroIcon">expand_more</span>
      </button>
      <span className="font-label-sm text-label-sm text-white/70 bg-white/10 px-2 py-0.5 rounded-full">Ref: LCGVM/2026/09-B</span>
      </div>
      </div>
      </div>
      </div>
      </div>
      {/*Search & Category Filter Section*/}
      <div className="mt-space-md">
      {/*Filter Chips Carousel*/}
      <div className="flex items-center gap-space-xs overflow-x-auto px-margin no-scrollbar py-1">
      <button className="filter-chip active flex-shrink-0 px-space-md py-space-xs rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-[0_8px_16px_-4px_rgba(28,42,200,0.35)] transition-all">
      All Notices
      </button>
      <button className="filter-chip flex-shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">
      Academic &amp; Exams
      </button>
      <button className="filter-chip flex-shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">
      Events &amp; Sports
      </button>
      <button className="filter-chip flex-shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">
      Holidays &amp; Admin
      </button>
      <button className="filter-chip flex-shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">
      Fee Alerts
      </button>
      </div>
      </div>
      {/*Feed Header & Counter*/}
      <div className="px-margin mt-space-md mb-space-xs flex items-center justify-between">
      <div className="flex items-center gap-space-xs">
      <span className="font-headline-sm text-headline-sm text-on-surface">Official Timeline</span>
      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">3 Recent</span>
      </div>
      <button className="flex items-center gap-1 font-label-sm text-label-sm text-primary hover:underline">
      <span className="material-symbols-outlined text-[16px]">tune</span>
      <span>Archive</span>
      </button>
      </div>
      {/*Timeline-style Feed*/}
      <div className="px-margin space-y-space-md">
      {/*NOTICE 1: PTM Schedule*/}
      <div className="relative pl-6">
      {/*Vertical connecting line node*/}
      <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-surface-container-highest"></div>
      {/*Glowing dot indicator*/}
      <div className="absolute left-0 top-3.5 w-4 h-4 rounded-full bg-surface flex items-center justify-center shadow-sm">
      <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></div>
      </div>
      <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] transition-all">
      {/*Metadata Header*/}
      <div className="flex items-start justify-between gap-space-sm mb-space-xs">
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
      <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
      Mandatory Attendance
      </span>
      <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">schedule</span>
      24 Sep 2026 • 2:23 PM
      </span>
      </div>
      {/*Title*/}
      <h3 className="font-headline-sm text-headline-sm text-on-surface">
      Parent-Teacher Meeting (PTM) Schedule for Class 12
      </h3>
      {/*Issuer Info*/}
      <div className="flex items-center gap-space-xs mt-1.5 mb-space-sm">
      <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-[11px] font-bold">
      BP
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Biswarup Paul (Academic Coordinator)</span>
      </div>
      {/*Body Message*/}
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
      Dear Parents &amp; Guardians, please find attached the personalized slot timings and campus venue map for the upcoming Term 1 Parent-Teacher Review. Roll calls 1 to 30 will be seated in Block C Auditorium.
      </p>
      {/*Attachment Mini Card*/}
      <div className="mt-space-md p-space-sm rounded-DEFAULT bg-surface-container-low flex flex-col gap-space-xs">
      <div className="flex items-center gap-space-sm">
      <div className="w-10 h-10 rounded-DEFAULT bg-error/10 text-error flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
      </div>
      <div className="min-w-0 flex-1">
      <div className="font-label-md text-label-md text-on-surface truncate font-bold">PTM_Schedule_2026.pdf</div>
      <div className="font-label-sm text-label-sm text-outline">1.2 MB • Acrobat Document</div>
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
      {/*NOTICE 2: Practical Exam Dates*/}
      <div className="relative pl-6">
      <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-surface-container-highest"></div>
      <div className="absolute left-0 top-3.5 w-4 h-4 rounded-full bg-surface flex items-center justify-center shadow-sm">
      <div className="w-2.5 h-2.5 rounded-full bg-secondary-container"></div>
      </div>
      <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] transition-all">
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
      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Exam Controller Board</span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
      Due to inter-district laboratory renovations, Computer Science and Physics Practical Sessions are rescheduled to commence from October 3rd. Keep lab logbooks updated and signed.
      </p>
      {/*Timetable Link Card*/}
      <a className="mt-space-sm inline-flex items-center justify-between w-full p-space-sm rounded-DEFAULT bg-surface-container-low hover:bg-surface-container transition-colors group" href="#">
      <div className="flex items-center gap-space-xs min-w-0">
      <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">View Revised Practical Timetable</span>
      </div>
      <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </a>
      </div>
      </div>
      {/*NOTICE 3: STEM & Robotics Exhibition*/}
      <div className="relative pl-6">
      <div className="absolute left-0 top-3.5 w-4 h-4 rounded-full bg-surface flex items-center justify-center shadow-sm">
      <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></div>
      </div>
      <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] transition-all">
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
      {/*Media Visual / Poster Placeholder*/}
      <div className="mt-space-sm mb-space-sm rounded-DEFAULT overflow-hidden relative">
      <img className="w-full h-36 object-cover" data-alt="High school students collaborating on an advanced robotics arm and micro-electronics prototype inside a luminous modern STEM school laboratory, cinematic soft natural lighting with deep indigo accent glows, sharp focus, educational excellence" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxVj4RqLWuUEBezKHjc6kkwd9AGSeNteX3Yi7PIr0GS4mo44WhWdIqKq060BjudY4G2xIFBh5_Q4s-3U0hG-xS5vCqlKq9qwInI8GvBrKBjNVMQI_7LtZRWJlnLSX_dPYMEZsCvKs9bpb6chFVhG-_ICzSI13-C9J4ooi8_EwH2CoeeWjLm6pVx27JLVGn9-US3HRxzolLA87Og6d1Xs03HH2-GXkEfShKmJ-VdBiRi6FkWy5C43vX8g"/>
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-sm text-label-sm">
      Grades 11 &amp; 12 Open
      </div>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
      Nominations are now invited for team leads in IoT Automation, Line-Follower Bots, and Clean Energy Models. Faculty mentorship sessions start this Saturday.
      </p>
      <div className="mt-space-md flex items-center gap-space-xs">
      <button className="flex-1 py-1.5 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm active:scale-98 transition-transform">
      <span>Register Project Proposal</span>
      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
      </button>
      </div>
      </div>
      </div>
      </div>
      {/*End of Feed Tactile Footer Indicator*/}
      <div className="mt-space-lg px-margin mb-space-xs text-center flex flex-col items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline mb-1">
      <span className="material-symbols-outlined text-[18px]">done_all</span>
      </div>
      <span className="font-label-sm text-label-sm text-outline">You are all caught up for Class 12-E</span>
      </div>
      </div>
      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:480px)]:max-w-none [@media(min-width:480px)]:left-0 [@media(min-width:480px)]:translate-x-0 [@media(min-width:480px)]:bg-surface/85 [@media(min-width:480px)]:backdrop-blur-2xl [@media(min-width:480px)]:border-t [@media(min-width:480px)]:border-outline/10 [@media(min-width:1024px)]:bottom-7" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto [@media(min-width:480px)]:px-0 [@media(min-width:480px)]:pb-0 [@media(min-width:480px)]:pt-0"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between [@media(min-width:480px)]:rounded-none [@media(min-width:480px)]:shadow-none [@media(min-width:480px)]:bg-transparent [@media(min-width:480px)]:backdrop-blur-none [@media(min-width:480px)]:max-w-[430px] [@media(min-width:480px)]:mx-auto"><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
