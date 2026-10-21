'use client';

import React from 'react';
import Link from 'next/link';
import LogoEmblem from './LogoEmblem';
import { useTenant } from '@/lib/context/TenantContext';

export default function PortalFooter() {
  const { tenant, slug, isPlatformRoot, isModuleEnabled } = useTenant();

  const schoolName = tenant?.school_name || (slug ? `${slug.toUpperCase()} School Campus` : isPlatformRoot ? 'NexaCampus Autonomous OS' : 'NexaCampus Partner School');
  const board = tenant?.affiliation_board || (slug ? 'CBSE' : 'CBSE / CISCE');
  const motto = tenant?.school_motto || (isPlatformRoot ? 'The Operating System for Next-Gen Autonomous Campuses' : 'Academic Excellence & Innovation');
  const location = tenant ? `${tenant.city}, ${tenant.state_territory}` : 'Autonomous Campus Network';
  const phone = tenant?.creator_phone || '+91 6289652321';
  const email = tenant ? `office@${tenant.subdomain_slug}.nexacampus.tech` : (slug ? `office@${slug}.nexacampus.tech` : 'global@nexacampus.tech');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline/10 mt-auto pt-6 pb-20 md:pt-10 md:pb-10 transition-colors font-sans">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8">
        {/* Top Institutional Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-5 md:pb-8 border-b border-outline/10">
          <div className="flex items-start md:items-center gap-3">
            <Link href="/" title={schoolName} className="flex-shrink-0 flex items-center">
              <LogoEmblem className="h-9 w-9 md:h-11 md:w-11 shadow-sm" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className="text-[15px] md:text-[17px] font-extrabold text-on-surface tracking-tight">
                  {schoolName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9.5px] md:text-[10px] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[12px] md:text-[13px]">verified</span>
                  {isPlatformRoot ? 'Multi-Tenant Cloud' : `${board} Affiliated`}
                </span>
              </div>
              <p className="font-body-sm text-[11px] md:text-[12px] text-on-surface-variant mt-0.5 leading-snug">
                {isPlatformRoot
                  ? 'Enterprise Education Infrastructure • Instant Subdomain Provisioning in 60s'
                  : `“${motto}” • Academic Session 2026–2027`}
              </p>
            </div>
          </div>

          {/* Institutional Badges */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-surface-container text-[10px] md:text-[11px] font-semibold text-on-surface-variant border border-outline/10">
              <span className="material-symbols-outlined text-[13px] md:text-[15px] text-tertiary">lock</span>
              256-Bit SSL Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-surface-container text-[10px] md:text-[11px] font-semibold text-on-surface-variant border border-outline/10">
              <span className="material-symbols-outlined text-[13px] md:text-[15px] text-primary">security</span>
              Autonomous Multi-Tenant OS
            </span>
          </div>
        </div>

        {/* Multi-column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 py-5 md:py-8 border-b border-outline/10 text-[12px] md:text-[13px]">
          {/* Column 1: Academics */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Academic Modules
            </span>
            <Link href="/home" className="text-on-surface-variant hover:text-primary transition-colors">
              Home Dashboard
            </Link>
            {isModuleEnabled('timetable') && (
              <Link href="/timetable" className="text-on-surface-variant hover:text-primary transition-colors">
                Class Timetable
              </Link>
            )}
            {isModuleEnabled('exams') && (
              <Link href="/exams" className="text-on-surface-variant hover:text-primary transition-colors">
                Exams &amp; Results
              </Link>
            )}
            {isModuleEnabled('diary') && (
              <Link href="/diary" className="text-on-surface-variant hover:text-primary transition-colors">
                Student Diary &amp; Homework
              </Link>
            )}
            {isModuleEnabled('attendance') && (
              <Link href="/attendance" className="text-on-surface-variant hover:text-primary transition-colors">
                Monthly Attendance
              </Link>
            )}
          </div>

          {/* Column 2: Campus Facilities */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Campus &amp; Facilities
            </span>
            {isModuleEnabled('bus') && (
              <Link href="/bus" className="text-on-surface-variant hover:text-primary transition-colors">
                Smart Bus Tracking
              </Link>
            )}
            {isModuleEnabled('canteen') && (
              <Link href="/canteen" className="text-on-surface-variant hover:text-primary transition-colors">
                Canteen &amp; Nutrition
              </Link>
            )}
            {isModuleEnabled('library') && (
              <Link href="/library" className="text-on-surface-variant hover:text-primary transition-colors">
                Digital Library
              </Link>
            )}
            {isModuleEnabled('health') && (
              <Link href="/health" className="text-on-surface-variant hover:text-primary transition-colors">
                Medical &amp; Infirmary
              </Link>
            )}
            {isModuleEnabled('hallpass') && (
              <Link href="/hallpass" className="text-on-surface-variant hover:text-primary transition-colors">
                E-Hallpass Movement
              </Link>
            )}
            {isModuleEnabled('store') && (
              <Link href="/store" className="text-on-surface-variant hover:text-primary transition-colors">
                Uniform &amp; Book Store
              </Link>
            )}
          </div>

          {/* Column 3: Co-Curricular & Community */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Activities &amp; Community
            </span>
            {isModuleEnabled('clubs') && (
              <Link href="/clubs" className="text-on-surface-variant hover:text-primary transition-colors">
                Student Activity Clubs
              </Link>
            )}
            {isModuleEnabled('merits') && (
              <Link href="/merits" className="text-on-surface-variant hover:text-primary transition-colors">
                Merits &amp; House Points
              </Link>
            )}
            {isModuleEnabled('lostfound') && (
              <Link href="/lostfound" className="text-on-surface-variant hover:text-primary transition-colors">
                Lost &amp; Found Desk
              </Link>
            )}
            {isModuleEnabled('notices') && (
              <Link href="/notices" className="text-on-surface-variant hover:text-primary transition-colors">
                School Circulars &amp; Notices
              </Link>
            )}
            {isModuleEnabled('ptm') && (
              <Link href="/ptm" className="text-on-surface-variant hover:text-primary transition-colors">
                Parent-Teacher Meetings
              </Link>
            )}
          </div>

          {/* Column 4: Contact & Support */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Contact &amp; Campus
            </span>
            <div className="flex items-start gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px] text-primary flex-shrink-0 mt-0.5">
                location_on
              </span>
              <span className="text-[12px] leading-relaxed">
                {location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px] text-primary flex-shrink-0">
                call
              </span>
              <span className="text-[12px]">
                <a href={`tel:${phone}`} className="inline-block py-1 hover:text-primary transition-colors underline-offset-2 hover:underline">
                  {phone}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px] text-primary flex-shrink-0">
                mail
              </span>
              <a href={`mailto:${email}`} className="text-[12px] inline-block py-1 hover:text-primary transition-colors underline-offset-2 hover:underline">
                {email}
              </a>
            </div>
            <div className="mt-2 pt-2 border-t border-outline/10">
              <Link
                href="/maker"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c2ac8] text-white text-[12px] font-bold hover:bg-[#15209e] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add_business</span>
                <span>Launch Your School App</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Version & Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-4 md:pt-6 text-[11px] md:text-[12px] text-on-surface-variant">
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap text-center md:text-left justify-center md:justify-start">
            <span>© {year} {schoolName}. Powered by NexaCampus Autonomous OS.</span>
            {tenant && (
              <>
                <span className="hidden md:inline">•</span>
                <span className="text-outline">Slug: {tenant.subdomain_slug}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-2.5 flex-wrap justify-center font-medium">
            <Link href="/explore" className="text-primary font-bold hover:underline">
              Explore Campuses
            </Link>
            <span>•</span>
            <Link href="/maker" className="text-amber-700 dark:text-amber-400 font-bold hover:underline">
              School Maker
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-primary transition-colors">
              Refund Policy
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
