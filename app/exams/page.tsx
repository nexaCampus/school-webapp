'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function ExamsPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:1024px)]:top-7"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Exams</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">
      <div className="flex flex-col w-full px-margin pb-space-lg">
      <section className="mt-space-sm bg-surface-container-lowest rounded-[20px] shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] p-space-lg">
      <div className="flex items-center justify-between">
      <div>
      <p className="font-label-sm text-label-sm font-bold text-on-surface-variant tracking-widest">HALL TICKET</p>
      <p className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Mid-Term Assessment 2026</p>
      </div>
      <span className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
      <span className="material-symbols-outlined text-primary text-[24px]">confirmation_number</span>
      </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-space-md font-body-sm text-body-sm">
      <div><p className="text-on-surface-variant">Candidate</p><p className="font-bold text-on-surface">Rajen Shaw</p></div>
      <div><p className="text-on-surface-variant">Class</p><p className="font-bold text-on-surface">Grade 12 · E</p></div>
      <div><p className="text-on-surface-variant">Roll / Adm No.</p><p className="font-bold text-on-surface">24 / 10211125</p></div>
      <div><p className="text-on-surface-variant">Centre</p><p className="font-bold text-on-surface">LCGVM-EX-004</p></div>
      </div>
      <div className="mt-space-md bg-surface-container-low rounded-[14px] px-3 py-2.5 flex items-center justify-between">
      <span className="text-[12px] font-bold text-on-surface">BLOCK C / SEAT #18</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">HALL-MID-2026-10211125</span>
      </div>
      <button className="w-full h-[48px] mt-space-md rounded-full bg-primary text-white text-[14px] font-bold flex items-center justify-center gap-2">
      <span className="material-symbols-outlined text-[18px]">download</span>Download Hall Ticket
      </button>
      </section>
      <section className="mt-space-md bg-surface-container-lowest rounded-[20px] shadow-sm p-4">
      <p className="text-[14px] font-bold text-on-surface">Term 1 Report Card</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">472 / 500 · 94.4% · Grade A+</p>
      <button className="mt-space-sm w-full h-[44px] rounded-full bg-primary/10 text-primary text-[13px] font-bold">Download Report Card</button>
      </section>
      </div>

      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:480px)]:max-w-none [@media(min-width:480px)]:left-0 [@media(min-width:480px)]:translate-x-0 [@media(min-width:480px)]:bg-surface/85 [@media(min-width:480px)]:backdrop-blur-2xl [@media(min-width:480px)]:border-t [@media(min-width:480px)]:border-outline/10 [@media(min-width:1024px)]:bottom-7" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto [@media(min-width:480px)]:px-0 [@media(min-width:480px)]:pb-0 [@media(min-width:480px)]:pt-0"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between [@media(min-width:480px)]:rounded-none [@media(min-width:480px)]:shadow-none [@media(min-width:480px)]:bg-transparent [@media(min-width:480px)]:backdrop-blur-none [@media(min-width:480px)]:max-w-[430px] [@media(min-width:480px)]:mx-auto"><Link aria-current="page" className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 text-on-surface-variant" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
