'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import DarkModeToggle from '@/components/DarkModeToggle';
import PortalFooter from '@/components/PortalFooter';
import { useTenant } from '@/lib/context/TenantContext';

export default function PrivacyPage() {
  const { tenant, isPlatformRoot } = useTenant();
  const schoolName = tenant?.school_name || 'Lions Calcutta Greater Vidya Mandir';
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Privacy Policy & Terms of Service | ${schoolName}`;
    }
  }, [schoolName]);

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#12131a] text-[#131b2e] dark:text-[#eaedff] flex flex-col justify-between selection:bg-[#3b49df] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#151622]/85 border-b border-[#e2e7ff]/70 dark:border-[#222538]/70 px-4 sm:px-6 lg:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <LogoEmblem className="h-10 w-10 drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] tracking-tight text-[#1c2ac8] dark:text-[#bdc2ff] group-hover:text-[#3b49df] transition-colors">
                {isPlatformRoot ? 'NexaCampus Cloud' : schoolName}
              </span>
              <span className="text-[11px] text-[#454655] dark:text-[#a0a4c0] font-medium hidden sm:inline-block">
                {isPlatformRoot ? 'Enterprise Operating System' : `${tenant?.affiliation_board || 'CISCE'} Affiliated • ${tenant?.city || 'Kolkata'}`}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white text-[13px] font-bold shadow-sm shadow-[#1c2ac8]/25 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Student Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        {/* Breadcrumb & Heading */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1c2ac8] dark:text-[#bdc2ff] hover:underline mb-3"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Campus Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#131b2e] dark:text-white">
            Institutional Privacy &amp; Terms
          </h1>
          <p className="text-sm text-[#454655] dark:text-[#a0a4c0] mt-2 leading-relaxed">
            {schoolName} ({tenant?.subdomain_slug?.toUpperCase() || 'LCGVM'} • Affiliation {tenant?.affiliation_board || 'CISCE'}) — Student Data Governance, Privacy Safeguards &amp; Acceptable Use Policy.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 p-1 bg-surface-container dark:bg-[#1a1c2b] rounded-full border border-outline/10 w-fit mb-8">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'privacy'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'terms'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Privacy Policy Content */}
        {activeTab === 'privacy' ? (
          <div className="space-y-6 text-sm text-[#454655] dark:text-[#c4c7e0] leading-relaxed">
            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">shield</span>
                <h2>1. Commitment to Student Privacy</h2>
              </div>
              <p>
                {schoolName} is dedicated to protecting the confidentiality, integrity, and accessibility of student, parent, and faculty information. The NexaCampus web application operates in compliance with {tenant?.affiliation_board || 'CISCE'} regulations and applicable data protection legislation.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">database</span>
                <h2>2. Data Collected &amp; Purpose</h2>
              </div>
              <p>We process the following categories of data solely for educational and administrative governance:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Academic Records:</strong> Marks, report cards, class attendance streaks, and homework assignments.</li>
                <li><strong>Student Identity:</strong> Permanent admission number, class section, roll number, and date of birth.</li>
                <li><strong>Guardian Contacts:</strong> Verified mobile phone numbers and email addresses for urgent school circulars.</li>
                <li><strong>Campus Transit &amp; Dining:</strong> Real-time school bus GPS telemetry and canteen smart card balances.</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">lock</span>
                <h2>3. Encryption &amp; Security Architecture</h2>
              </div>
              <p>
                All data transmission between the browser and NexaCampus servers is safeguarded with 256-bit Transport Layer Security (TLS 1.3). Student identity tokens are cryptographically salted and isolated by school tenant ID. Biometric vitals and infirmary medical records are restricted to authorized health staff.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">contact_support</span>
                <h2>4. Data Rights &amp; Officer Contact</h2>
              </div>
              <p>
                Guardians may review, amend, or request verification of their ward&apos;s stored profile at any time through the{' '}
                <Link href="/helpdesk" className="text-primary font-bold hover:underline">
                  Parent Help Desk
                </Link>{' '}
                or by contacting the School Data Administration Office:
              </p>
              <div className="p-3 rounded-xl bg-surface-container dark:bg-[#25283d] text-xs font-mono space-y-1">
                <div>Email: <a href="mailto:office@lcgvm.edu.in" className="text-primary hover:underline">office@lcgvm.edu.in</a></div>
                <div>Phone: <a href="tel:+913324371234" className="text-primary hover:underline">+91 33 2437 1234</a></div>
                <div>Address: Subhasgram, Kolkata, West Bengal — 700147</div>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-sm text-[#454655] dark:text-[#c4c7e0] leading-relaxed">
            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">gavel</span>
                <h2>1. Terms of Educational Access</h2>
              </div>
              <p>
                By signing in to the NexaCampus portal via Admission Number, Google Single Sign-On, or Registered Email, students and guardians agree to maintain the confidentiality of their credentials and adhere to the school&apos;s code of digital ethics.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">verified_user</span>
                <h2>2. Authorized Usage &amp; Digital Corridor Pass</h2>
              </div>
              <p>
                Dynamic QR digital hall passes generated within the system are valid solely for the designated student and corridor timeframe. Re-sharing or screenshot tampering is strictly prohibited and subject to disciplinary review.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#bdc2ff] font-bold text-base">
                <span className="material-symbols-outlined">payments</span>
                <h2>3. Fee Receipts &amp; Canteen Wallet</h2>
              </div>
              <p>
                Online fee statements, exam admit cards, and smart canteen balances displayed on NexaCampus reflect official institutional records. Queries concerning payment reconciliations can be logged directly through the Parent Desk module.
              </p>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <PortalFooter />
    </div>
  );
}
