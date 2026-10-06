'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import LogoEmblem from '@/components/LogoEmblem';
import AuthFooter from '@/components/AuthFooter';
import DarkModeToggle from '@/components/DarkModeToggle';

function DesktopMethodCard({
  href,
  title,
  subtitle,
  badge,
  icon,
  iconWell,
  accent,
}: {
  href: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  iconWell: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline/10 p-4 flex items-center gap-4 hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.99] group"
    >
      <span
        className={`w-12 h-12 rounded-xl ${iconWell} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
      >
        <span className={`material-symbols-outlined ${accent} text-[26px]`}>{icon}</span>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors">
          {title}
        </span>
        <span className="block font-body-sm text-body-sm text-on-surface-variant leading-snug mt-0.5">
          {subtitle}
        </span>
        <span
          className={`inline-block mt-1.5 text-[10px] font-bold ${accent} bg-surface-container-high rounded-full px-2.5 py-0.5`}
        >
          {badge}
        </span>
      </span>
      <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-[22px]">
        arrow_forward
      </span>
    </Link>
  );
}

function MobileMethodCard({
  href,
  title,
  subtitle,
  badge,
  badgeWell = 'bg-surface-container-high text-on-surface-variant',
  icon,
  iconWell,
  accent,
}: {
  href: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeWell?: string;
  icon: string;
  iconWell: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="w-full bg-surface-container-lowest dark:bg-[#121929] rounded-[22px] shadow-[0_8px_20px_rgba(28,42,200,0.08)] dark:shadow-none border border-outline/10 p-3.5 sm:p-4 flex items-center gap-3.5 active:scale-[0.99] transition-transform"
    >
      <span
        className={`w-[46px] h-[46px] rounded-[14px] ${iconWell} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        <span className={`material-symbols-outlined ${accent} text-[24px]`}>{icon}</span>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-bold text-on-surface leading-snug">{title}</span>
        <span className="block text-[12px] text-on-surface-variant leading-[16px] mt-0.5">
          {subtitle}
        </span>
        <span
          className={`inline-block mt-1 text-[9px] font-bold ${badgeWell} rounded-full px-2 py-0.5`}
        >
          {badge}
        </span>
      </span>
      <span className="material-symbols-outlined text-outline text-[20px] flex-shrink-0">
        arrow_forward
      </span>
    </Link>
  );
}

export default function ChooserPage() {
  const router = useRouter();

  useEffect(() => {
    const s = getSession();
    if (s?.student || s?.name) {
      router.replace('/home');
    }
  }, [router]);

  return (
    <>
      {/* ========================================================
          MOBILE VIEW (< 768px): 70% Height from Below with LCGVM Branding & CISCE
          ======================================================== */}
      <div className="md:hidden relative min-h-screen bg-gradient-to-b from-[#1c2ac8] via-[#121c88] to-[#0a1040] flex flex-col justify-between overflow-x-hidden">
        {/* Top 30% Area: Ambient School Branding with Crest & Dark Mode Toggle */}
        <div className="relative pt-safe px-4 pb-8 flex flex-col justify-between min-h-[28vh] flex-shrink-0 overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute top-10 -right-10 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />

          {/* Top Bar: LCGVM Tag & Dark Mode Toggle */}
          <div className="flex items-center justify-between pt-2 relative z-10">
            <div className="flex items-center gap-2">
              <LogoEmblem className="h-7 w-7 shadow-sm" />
              <span className="text-[12px] font-extrabold text-white tracking-wider uppercase">
                LCGVM
              </span>
            </div>
            <DarkModeToggle className="bg-white/15 dark:bg-slate-800/80 text-white border-white/20 hover:bg-white/25" />
          </div>

          {/* Center Brand Identity */}
          <div className="flex flex-col items-center text-center mt-2 relative z-10">
            <div className="w-[62px] h-[62px] rounded-full bg-white/15 backdrop-blur-md p-1 shadow-lg border border-white/25 mb-2">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-white/30 to-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[30px]">verified</span>
              </div>
            </div>
            <h2 className="text-[16px] font-extrabold text-white leading-tight">
              Lions Calcutta Greater Vidya Mandir
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-secondary-fixed bg-white/15 rounded-full px-2.5 py-0.5 border border-white/20">
                LCGVM Portal • CISCE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 70% Area: The Beloved Content Panel from Below */}
        <div className="w-full bg-surface dark:bg-[#0b0f19] rounded-t-[34px] shadow-[0_-16px_40px_rgba(0,0,0,0.3)] border-t border-outline/10 px-margin pt-4 pb-safe flex-1 flex flex-col justify-between z-20 min-h-[72vh] overflow-y-auto">
          {/* Subtle sheet indicator */}
          <div className="w-10 h-1 rounded-full bg-outline/25 mx-auto mb-3 flex-shrink-0" />

          {/* Title & Subtitle */}
          <div className="text-center mb-3">
            <h1 className="font-headline-md text-[20px] font-extrabold text-on-surface tracking-tight">
              How would you like to sign in?
            </h1>
            <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
              Pick the credential the school has on file for you.
            </p>
          </div>

          {/* Method Selection Cards */}
          <div className="w-full space-y-3 my-auto">
            <MobileMethodCard
              href="/admission"
              title="Admission Number"
              subtitle="Issued on your physical student ID card and fee receipt"
              badge="Registered Student"
              badgeWell="bg-primary/10 text-primary"
              icon="badge"
              iconWell="bg-primary-fixed"
              accent="text-primary"
            />
            <MobileMethodCard
              href="/email"
              title="Email or Google Account"
              subtitle="Sign in with your registered Google account or guardian email"
              badge="Google + Email"
              badgeWell="bg-[#d7f5e7] text-tertiary"
              icon="mail"
              iconWell="bg-[#D7F5E7]"
              accent="text-tertiary"
            />

            <div className="w-full bg-surface-container-low dark:bg-slate-800/60 rounded-xl p-3 flex gap-2.5 border border-outline/10">
              <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">
                info
              </span>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-[16px]">
                Admission numbers resolve against the live school roster. Once authenticated, your session persists securely on this device.
              </p>
            </div>
          </div>

          {/* Support Helpline & CISCE Footer */}
          <div className="mt-4 pt-3 border-t border-outline/10 flex flex-col items-center gap-1.5 w-full text-center">
            <span className="text-[11px] text-on-surface-variant">Need help logging in?</span>
            <span className="flex items-center gap-1.5 text-primary text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>Contact School Admin Office</span>
            </span>

            <div className="mt-2 text-[10px] text-outline flex items-center justify-center gap-1.5 flex-wrap">
              <span>Lions Calcutta Greater Vidya Mandir</span>
              <span>•</span>
              <span className="font-bold text-primary">CISCE Affiliated</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (>= 768px): The exact Laptop Split Card from Image 2
          ======================================================== */}
      <div className="hidden md:flex relative min-h-screen bg-surface flex-col justify-between w-full overflow-y-auto">
        {/* Ambient Backdrop Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

        {/* Top Header with Dark Mode Toggle */}
        <div className="max-w-4xl mx-auto w-full pt-6 px-6 flex justify-end relative z-20">
          <DarkModeToggle />
        </div>

        {/* Centered Split Card Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 w-full relative z-10">
          {/* Main Responsive Split Card Container */}
          <div className="w-full max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl shadow-[0_24px_70px_-12px_rgba(28,42,200,0.16)] border border-outline/10 overflow-hidden grid grid-cols-12 relative z-10">
            {/* Left Branding Rail on Desktop */}
            <div className="col-span-5 bg-gradient-to-br from-primary via-[#2435df] to-[#121c88] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle decorative circles */}
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />

              {/* Top Brand Header */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <LogoEmblem className="h-11 w-11 shadow-sm" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold block">
                      Official Academic Gateway
                    </span>
                    <span className="text-[17px] font-extrabold text-white leading-tight block">
                      Lions Calcutta
                    </span>
                    <span className="text-[13px] font-semibold text-secondary-fixed">
                      Gr Vidya Mandir
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h2 className="text-[22px] font-bold leading-tight">
                    Welcome to the LCGVM Digital Portal
                  </h2>
                  <p className="text-[13px] text-white/80 leading-relaxed">
                    Seamless real-time access for students, teachers, and guardians across all academic modules.
                  </p>
                </div>
              </div>

              {/* Feature Bullets */}
              <div className="relative z-10 space-y-3 py-6 border-y border-white/10 my-4 text-[13px] text-white/90">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                    check_circle
                  </span>
                  <span>Live Attendance &amp; Class Timetable</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                    check_circle
                  </span>
                  <span>Report Cards &amp; Exam Hall Tickets</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                    check_circle
                  </span>
                  <span>Direct Parent Desk &amp; Fee Receipts</span>
                </div>
              </div>

              {/* Footer Institutional Tag */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70">
                <span>CISCE Affiliated · Secure SSL</span>
                <span>v2.5.3</span>
              </div>
            </div>

            {/* Right Action Rail */}
            <div className="col-span-7 p-8 md:p-10 flex flex-col justify-center">
              {/* Desktop Heading */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-3 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  <span>Secure Authentication</span>
                </div>
                <h1 className="text-[26px] font-extrabold text-on-surface tracking-tight">
                  Select Sign In Method
                </h1>
                <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">
                  Pick the credential currently on file with the school administration.
                </p>
              </div>

              {/* Selection Cards */}
              <div className="space-y-4">
                <DesktopMethodCard
                  href="/admission"
                  title="Admission Number"
                  subtitle="Issued on your physical student ID card and fee receipt"
                  badge="Registered Student"
                  icon="badge"
                  iconWell="bg-primary-fixed"
                  accent="text-primary"
                />
                <DesktopMethodCard
                  href="/email"
                  title="Email or Google Account"
                  subtitle="Sign in with your registered Google account or guardian email"
                  badge="Google + Email"
                  icon="mail"
                  iconWell="bg-[#D7F5E7]"
                  accent="text-tertiary"
                />
              </div>

              {/* Helpful Information Note */}
              <div className="bg-surface-container-low/70 rounded-2xl p-3.5 flex gap-3 mt-6 border border-outline/5">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">
                  info
                </span>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                  Admission numbers resolve against the live school roster. Once authenticated, your session persists securely on this device.
                </p>
              </div>

              {/* Support Helpline Footer */}
              <div className="mt-8 pt-4 border-t border-outline/10 flex flex-row items-center justify-between gap-2 text-[12px] text-on-surface-variant">
                <span>Need help logging in?</span>
                <span className="flex items-center gap-1.5 text-primary font-bold hover:underline cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">support_agent</span>
                  <span>Contact School Admin Office</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Desktop Institutional Footer */}
        <AuthFooter />
      </div>
    </>
  );
}
