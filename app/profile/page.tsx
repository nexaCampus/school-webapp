'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function ProfilePage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Profile</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface"><div className="flex flex-col w-full px-margin pb-space-lg">
      <div className="relative w-full rounded-lg bg-surface-container-lowest p-space-lg shadow-[0_12px_28px_-6px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(59,73,223,0.04)] mb-space-md overflow-hidden">
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-10 w-28 h-28 rounded-full bg-secondary-fixed/40 blur-xl pointer-events-none"></div>
      <div className="relative z-10 flex flex-col items-center text-center">
      <div className="relative mb-space-sm">
      <div className="w-24 h-24 rounded-full p-1 bg-surface-container-high shadow-md">
      <img alt="Rajen Shaw" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2HL6mlKQFX_TInOT64dMFoflC4pOZFhVO5vC5KUg1zG9aHWIOAG0BaM1MKOq5v0-qHFzN-DbWra0R-q7csvdmGY2a4mn1n3BTf4p5TiCeBP5PLiuuzrRqvOFPDb4JC8ND8nLDArYAjww0YpZMpS-hcdGZOaAEEZc5c145anZkYFBjtzMVFHzb5MK3JXtUSrInlrm8-i6kElfgmG6pQgJJv6m10BZjJ9goEvKG0Mr6qs3VDu4p0sD1Bw"/>
      </div>
      <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-[0_2px_8px_rgba(0,80,54,0.35)]" title="Verified Record">
      <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
      </div>
      </div>
      <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1">Rajen Shaw</h1>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-md mb-space-xs">
      <span className="material-symbols-outlined text-[16px]">school</span>
      <span>Class 12 • Section E</span>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm uppercase tracking-wider mb-space-md">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
      <span>Active Student • AY 2026-2027</span>
      </div>
      <div className="grid grid-cols-2 gap-space-sm w-full pt-space-xs">
      <div className="bg-surface-container-low rounded-DEFAULT p-3 flex flex-col items-center justify-center">
      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Roll Number</span>
      <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">20</span>
      </div>
      <div className="bg-surface-container-low rounded-DEFAULT p-3 flex flex-col items-center justify-center">
      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Admission ID</span>
      <span className="font-headline-sm text-headline-sm text-primary mt-0.5">#10211125</span>
      </div>
      </div>
      </div>
      </div>
      <div className="flex items-center justify-between px-1 mb-space-sm">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Student &amp; Guardian Details</h2>
      </div>
      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Official Data</span>
      </div>
      <div className="rounded-lg bg-surface-container-lowest p-space-md shadow-sm mb-space-lg flex flex-col gap-space-sm">
      <div className="grid grid-cols-2 gap-space-sm">
      <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
      </div>
      <div className="min-w-0">
      <p className="font-label-sm text-label-sm text-outline">Date of Birth</p>
      <p className="font-body-md text-body-md text-on-surface font-semibold truncate">10-02-2007</p>
      </div>
      </div>
      <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="w-9 h-9 rounded-full bg-error-container/40 flex items-center justify-center text-error flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">bloodtype</span>
      </div>
      <div className="min-w-0">
      <p className="font-label-sm text-label-sm text-outline">Blood Group</p>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error font-label-md text-label-md font-bold">
      A +ve
      </span>
      </div>
      </div>
      </div>
      <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">family_restroom</span>
      </div>
      <div className="min-w-0 flex-1">
      <p className="font-label-sm text-label-sm text-outline">Father's Name</p>
      <p className="font-body-md text-body-md text-on-surface font-medium truncate">Krishna Shaw</p>
      </div>
      </div>
      <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">face_3</span>
      </div>
      <div className="min-w-0 flex-1">
      <p className="font-label-sm text-label-sm text-outline">Mother's Name</p>
      <p className="font-body-md text-body-md text-on-surface font-medium truncate">Geeta Shaw</p>
      </div>
      </div>
      <div className="flex items-center justify-between gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
      </div>
      <div className="min-w-0">
      <p className="font-label-sm text-label-sm text-outline">Registered Mobile</p>
      <p className="font-body-md text-body-md text-on-surface font-medium truncate">+91 91798 0679513</p>
      </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
      <a aria-label="Call Registered Contact" className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition-transform" href="tel:+91917980679513">
      <span className="material-symbols-outlined text-[16px]">call</span>
      </a>
      <a aria-label="Message Registered Contact" className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center hover:bg-primary-fixed active:scale-95 transition-transform" href="sms:+91917980679513">
      <span className="material-symbols-outlined text-[16px]">sms</span>
      </a>
      </div>
      </div>
      <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">mail</span>
      </div>
      <div className="min-w-0 flex-1">
      <p className="font-label-sm text-label-sm text-outline">Guardian Email</p>
      <p className="font-body-md text-body-md text-on-surface font-medium truncate">krishnashaw2005@gmail.com</p>
      </div>
      </div>
      <div className="flex items-start gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
      <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
      <span className="material-symbols-outlined text-[20px]">pin_drop</span>
      </div>
      <div className="min-w-0 flex-1">
      <p className="font-label-sm text-label-sm text-outline">Residential Address</p>
      <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
      Subhasgram, Manasatala Park, Chak Harinavi, Kolkata - 700147
      </p>
      </div>
      </div>
      </div>
      <div className="flex items-center justify-between px-1 mb-space-sm">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[20px]">security</span>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Security &amp; App Preferences</h2>
      </div>
      </div>
      <div className="rounded-lg bg-surface-container-lowest p-space-md shadow-sm mb-space-xl flex flex-col gap-space-xs">
      <button className="w-full flex items-center justify-between p-space-sm rounded-DEFAULT hover:bg-surface-container transition-colors text-left group" type="button">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
      </div>
      <div>
      <p className="font-body-md text-body-md text-on-surface font-semibold">Change Portal Password</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated 45 days ago</p>
      </div>
      </div>
      <span className="material-symbols-outlined text-outline group-hover:translate-x-0.5 transition-transform text-[20px]">chevron_right</span>
      </button>
      <div className="w-full flex items-center justify-between p-space-sm rounded-DEFAULT hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">mark_chat_unread</span>
      </div>
      <div>
      <p className="font-body-md text-body-md text-on-surface font-semibold">Push &amp; SMS Alerts</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Homework and attendance notices</p>
      </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-2 flex-shrink-0">
      <input defaultChecked className="sr-only peer" id="notif-toggle" type="checkbox"/>
      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
      </div>
      <div className="w-full flex items-center justify-between p-space-sm rounded-DEFAULT hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[20px]">fingerprint</span>
      </div>
      <div>
      <p className="font-body-md text-body-md text-on-surface font-semibold">Biometric Sign-In</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Face ID / Touch Unlock</p>
      </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-2 flex-shrink-0">
      <input defaultChecked className="sr-only peer" id="bio-toggle" type="checkbox"/>
      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
      </div>
      </div>
      <div className="w-full flex flex-col items-center">
      <button className="w-full py-3.5 px-space-md rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all duration-200 flex items-center justify-center gap-2 shadow-sm font-label-lg text-label-lg active:scale-[0.98]" id="open-logout-btn" type="button">
      <span className="material-symbols-outlined text-[20px]">logout</span>
      <span>Log Out of Account</span>
      </button>
      <p className="font-label-sm text-label-sm text-outline mt-space-xs text-center">Version 3.4.1 (Build 2026.04) • EduPortal Student OS</p>
      </div>
      <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm hidden items-center justify-center px-margin max-w-[430px] left-1/2 -translate-x-1/2" id="logout-modal">
      <div className="w-full max-w-sm rounded-lg bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
      <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mb-space-sm">
      <span className="material-symbols-outlined text-[30px]">warning</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Confirm Log Out?</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
      You will need your student admission ID (<strong className="text-on-surface">10211125</strong>) and password to re-enter the academic portal.
      </p>
      <div className="flex flex-col w-full gap-2">
      <button className="w-full py-3 rounded-full bg-error text-on-error font-label-lg text-label-lg shadow-sm hover:opacity-90 active:scale-95 transition-all" id="confirm-logout-btn" type="button">
      Yes, Log Out
      </button>
      <button className="w-full py-3 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-container-highest active:scale-95 transition-all" id="cancel-logout-btn" type="button">
      Cancel &amp; Stay
      </button>
      </div>
      </div>
      </div>
      </div>
      </main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between"><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link aria-current="page" className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 text-on-surface-variant" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
