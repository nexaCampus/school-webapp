'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function BusPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:1024px)]:top-7"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Bus</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">
      <div className="flex flex-col w-full px-margin pb-space-lg">
      <section className="relative mt-space-sm bg-gradient-to-br from-primary to-primary-container rounded-lg p-space-lg text-white overflow-hidden shadow-[0_12px_28px_-6px_rgba(28,42,200,0.35)]">
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10"></div>
      <p className="font-label-sm text-label-sm font-bold tracking-widest opacity-80">ROUTE 14-A · WB-02-AK-9821</p>
      <p className="font-display-lg-mobile text-display-lg-mobile mt-1">7 min away</p>
      <p className="font-body-md text-body-md opacity-90 mt-0.5">Next stop: Ultadanga Crossing</p>
      <div className="h-1.5 rounded-full bg-white/25 mt-space-md overflow-hidden">
      <div className="h-full w-3/4 rounded-full bg-white"></div>
      </div>
      </section>
      <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-4 mt-space-md flex items-center gap-3">
      <span className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-on-surface-variant text-[22px]">person</span>
      </span>
      <div className="flex-1">
      <p className="text-[14px] font-bold text-on-surface">Rajeshwar Singh</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Driver · +91 98312 45890</p>
      </div>
      <a href="tel:+919831245890" className="w-11 h-11 rounded-full bg-tertiary/10 flex items-center justify-center">
      <span className="material-symbols-outlined text-tertiary text-[20px]">call</span>
      </a>
      </div>
      <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-4 mt-space-sm flex items-center gap-3">
      <span className="material-symbols-outlined text-secondary text-[22px]">pin_drop</span>
      <div>
      <p className="text-[14px] font-bold text-on-surface">Your stop: Ultadanga Junction</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Scheduled pickup 07:35 AM</p>
      </div>
      </div>
      </div>

      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:480px)]:max-w-none [@media(min-width:480px)]:left-0 [@media(min-width:480px)]:translate-x-0 [@media(min-width:480px)]:bg-surface/85 [@media(min-width:480px)]:backdrop-blur-2xl [@media(min-width:480px)]:border-t [@media(min-width:480px)]:border-outline/10 [@media(min-width:1024px)]:bottom-7" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto [@media(min-width:480px)]:px-0 [@media(min-width:480px)]:pb-0 [@media(min-width:480px)]:pt-0"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between [@media(min-width:480px)]:rounded-none [@media(min-width:480px)]:shadow-none [@media(min-width:480px)]:bg-transparent [@media(min-width:480px)]:backdrop-blur-none [@media(min-width:480px)]:max-w-[430px] [@media(min-width:480px)]:mx-auto"><Link aria-current="page" className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 text-on-surface-variant" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
