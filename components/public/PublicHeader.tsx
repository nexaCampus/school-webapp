'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  dropdown?: { label: string; href: string; desc?: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Governance',
    href: '/disclosures',
    dropdown: [
      { label: 'Mandatory Public Disclosures', href: '/disclosures', desc: 'CBSE & CISCE compliance, society certificates & fire safety' },
      { label: "Principal's Desk", href: '/#principal', desc: 'Welcome address from Dr. S. Mukherjee, Principal' },
      { label: 'Managing Committee', href: '/disclosures#committee', desc: 'Governing body, patron list & trust deed' },
      { label: 'Annual Academic Report', href: '/disclosures#reports', desc: 'Audited institutional report card 2025-26' },
    ],
  },
  {
    label: 'Academics',
    href: '/academics',
    dropdown: [
      { label: 'Curriculum & Streams', href: '/academics', desc: 'ICSE & ISC Senior Secondary (Science, Commerce, Humanities)' },
      { label: 'Faculty Directory', href: '/faculty', desc: 'PGT/TGT faculty credentials, qualifications & departments' },
      { label: 'Syllabus & Course Plans', href: '/academics#syllabus', desc: 'Session 2026-27 terminal syllabus downloads' },
      { label: 'Board Examination Results', href: '/exams', desc: 'Historic 100% pass record, subject toppers & merit list' },
    ],
  },
  {
    label: 'Admissions',
    href: '/apply',
    badge: '2026-27 Open',
    dropdown: [
      { label: 'Online Application 2026-27', href: '/apply', desc: 'Interactive 4-step wizard for Nursery through Class XI' },
      { label: 'Annual Fee Structure', href: '/disclosures#fees', desc: 'Class-wise fee breakdown, lab dues & quarterly dates' },
      { label: 'Track Application Status', href: '/apply#track', desc: 'Real-time candidate verification status search' },
      { label: 'Admission Prospectus (PDF)', href: '/apply#prospectus', desc: 'Download official guidelines & entrance syllabus' },
    ],
  },
  {
    label: 'Campus & Transit',
    href: '/facilities',
    dropdown: [
      { label: 'Infrastructure & Labs', href: '/facilities', desc: '14+ specialized laboratories, robotics center & sports turf' },
      { label: 'Bus Route Directory', href: '/facilities#transit', desc: 'Route stops, timings, supervisor contacts & GPS fleet' },
      { label: 'Health Infirmary & Cafeteria', href: '/facilities#health', desc: 'On-campus medical team, hygiene & student dining' },
    ],
  },
  {
    label: 'Explore Campuses',
    href: '/explore',
    badge: 'Directory',
  },
];

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full select-none z-50 relative font-sans">
      {/* ============================================================ */}
      {/* DESKTOP TIER 1: OFFICIAL INSTITUTIONAL GAZETTE & AFFILIATION BAR */}
      {/* ============================================================ */}
      <div className="hidden lg:block bg-oxford text-slate-300 text-xs py-2 px-6 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Official Affiliation Line */}
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold text-[11px] border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              AFFILIATED TO CISCE, NEW DELHI
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-[11px] text-slate-200">School Code: WB-243</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-[11px] text-slate-200">CBSE Secondary Reg: 1930281</span>
          </div>

          {/* Institutional Contact & Quick Access Portals */}
          <div className="flex items-center space-x-5 text-[11px]">
            <a
              href="tel:+913324428000"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 (033) 2442-8000</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="mailto:principal@lcgvm.edu.in"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>principal@lcgvm.edu.in</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link
              href="/disclosures"
              className="hover:text-amber-300 font-medium transition-colors"
            >
              Mandatory Disclosures
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/maker"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <span>Institutional Builder</span>
              <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1 rounded">SaaS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP TIER 2: STATELY INSTITUTIONAL CREST & MAIN NAVIGATION */}
      {/* ============================================================ */}
      <div
        className={`bg-white border-b border-slate-200 transition-shadow duration-300 ${
          isScrolled ? 'shadow-md sticky top-0 z-40' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Institutional Crest and Seal */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-13 h-13 rounded-full bg-oxford text-amber-300 flex items-center justify-center p-2.5 shadow-sm border-2 border-amber-500/40 group-hover:border-amber-400 transition-colors">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                {/* Academic Crest Shield & Torch Vector */}
                <path d="M20 3L6 9V19C6 27.5 12 35 20 37C28 35 34 27.5 34 19V9L20 3Z" fill="#0A192F" stroke="#F59E0B" strokeWidth="2" />
                <path d="M20 10V28M13 18L20 22L27 18" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="9" r="2.5" fill="#F59E0B" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg md:text-xl text-oxford tracking-tight leading-tight">
                  Lions Calcutta Greater Vidyamandir
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 rounded border border-slate-200">
                  Estd. 1991
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium tracking-wide flex items-center gap-2">
                <span>Higher Secondary Co-Educational Institution</span>
                <span className="text-slate-300">•</span>
                <span className="italic font-serif text-slate-500">Tamaso Ma Jyotirgamaya</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = item.dropdown && item.dropdown.length > 0;
              return (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-oxford hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-burgundy/10 text-burgundy border border-burgundy/20">
                        {item.badge}
                      </span>
                    )}
                    {hasDropdown && (
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Mega-Dropdown Menu */}
                  {hasDropdown && (
                    <div
                      className={`absolute left-0 top-full pt-2 w-80 transition-all duration-200 ${
                        activeDropdown === item.label
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-slate-200/80 p-2.5 overflow-hidden">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 border-b border-slate-100 mb-1">
                          Institutional {item.label}
                        </div>
                        {item.dropdown!.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 rounded-md hover:bg-slate-50 transition-colors group/sub"
                          >
                            <div className="text-xs font-semibold text-slate-800 group-hover/sub:text-oxford">
                              {sub.label}
                            </div>
                            {sub.desc && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {sub.desc}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Action Hub */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/chooser"
              className="px-3.5 py-2 text-xs font-semibold text-oxford bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-300"
            >
              Sign In
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-oxford hover:bg-slate-800 rounded-md shadow-sm transition-all border border-oxford"
            >
              <span>Apply Online 2026</span>
              <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* MOBILE VIEWPORT (375px/390px): NATIVE TAP HEADER & CALL PILL */}
          {/* ============================================================ */}
          <div className="lg:hidden flex items-center space-x-2">
            <a
              href="tel:+913324428000"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold"
              aria-label="Call school emergency helpline"
            >
              <svg className="w-3 h-3 text-red-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Helpline</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-oxford hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE COLLAPSIBLE DRAWER (ACCESSIBLE 375px PHONE MODAL)     */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-h-[85vh] rounded-b-2xl shadow-2xl overflow-y-auto p-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-oxford text-amber-300 flex items-center justify-center font-serif font-bold text-xs">
                  LCG
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-oxford">LCG Vidyamandir</div>
                  <div className="text-[10px] text-slate-500 font-mono">CISCE Code: WB-243</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="py-1">
                  <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-slate-50">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-semibold text-sm text-slate-800"
                    >
                      {item.label}
                    </Link>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-burgundy/10 text-burgundy">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.dropdown && (
                    <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-100">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-2 py-1.5 text-xs text-slate-600 hover:text-oxford"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-oxford rounded-md block shadow-sm"
              >
                Apply Online 2026-27
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/disclosures"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-medium text-slate-700 bg-slate-100 rounded-md block"
                >
                  Disclosures
                </Link>
                <Link
                  href="/maker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-md block"
                >
                  School Maker
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
