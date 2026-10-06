'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function TimetablePage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Timetable</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">
      <div className="flex flex-col w-full px-margin pb-space-lg">
      <div className="flex gap-2 mt-space-sm overflow-x-auto pb-1">
      <span className="px-4 py-2 rounded-full text-[12px] font-bold bg-surface-container-high text-on-surface-variant whitespace-nowrap">MON 22</span>
      <span className="px-4 py-2 rounded-full text-[12px] font-bold bg-surface-container-high text-on-surface-variant whitespace-nowrap">TUE 23</span>
      <span className="px-4 py-2 rounded-full text-[12px] font-bold bg-primary text-white whitespace-nowrap shadow-[0_8px_20px_-4px_rgba(28,42,200,0.4)]">WED 24</span>
      <span className="px-4 py-2 rounded-full text-[12px] font-bold bg-surface-container-high text-on-surface-variant whitespace-nowrap">THU 25</span>
      <span className="px-4 py-2 rounded-full text-[12px] font-bold bg-surface-container-high text-on-surface-variant whitespace-nowrap">FRI 26</span>
      </div>
      <section className="mt-space-md flex flex-col gap-space-sm">
      <div className="bg-tertiary/10 border border-tertiary/20 rounded-[18px] p-4">
      <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-tertiary bg-white rounded-full px-2 py-0.5">LIVE NOW · P1</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">08:30 – 09:30 AM</span>
      </div>
      <p className="text-[15px] font-bold text-on-surface mt-1.5">Physics Lab (Optics &amp; Laser)</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Dr. Aris Thorne · Physics Lab 3</p>
      </div>
      <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-4">
      <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-primary">P2</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">09:40 – 10:35 AM</span>
      </div>
      <p className="text-[15px] font-bold text-on-surface mt-1.5">Mathematics II</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Mrs. S. Roy · Room 402</p>
      </div>
      <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-4">
      <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-primary">P3</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">10:45 – 11:40 AM</span>
      </div>
      <p className="text-[15px] font-bold text-on-surface mt-1.5">Chemistry (Aldehydes &amp; Ketones)</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Mrs. D. Sen · Room 305</p>
      </div>
      </section>
      </div>

      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between"><Link aria-current="page" className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 text-on-surface-variant" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
