'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/lib/context/TenantContext';
import DarkModeToggle from '@/components/DarkModeToggle';
import LogoEmblem from '@/components/LogoEmblem';
import SchoolNavDrawer from './SchoolNavDrawer';

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  dropdown?: { label: string; href: string; desc?: string }[];
}

export default function PublicHeader() {
  const pathname = usePathname();
  const isChooserRoute = pathname === '/chooser' || pathname?.startsWith('/chooser');
  const { tenant, slug: contextSlug, isPlatformRoot, isModuleEnabled } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schoolDrawerOpen, setSchoolDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slug = tenant?.subdomain_slug || contextSlug || '';
  const schoolName = tenant?.school_name || (slug ? `${slug.toUpperCase()} School Campus` : isPlatformRoot ? 'NexaCampus OS' : 'NexaCampus Partner School');
  const motto = tenant?.school_motto || (slug ? 'Autonomous Campus Operating System' : isPlatformRoot ? 'Autonomous Multi-Tenant School Operating System' : 'Academic Excellence & Innovation');
  const board = tenant?.affiliation_board || (slug ? 'CBSE' : isPlatformRoot ? 'All Boards' : 'CBSE / CISCE');
  const phone = tenant?.creator_phone || '+91 6289652321';
  const email = tenant ? `office@${tenant.subdomain_slug}.nexacampus.tech` : (slug ? `office@${slug}.nexacampus.tech` : 'support@nexacampus.tech');

  const signInUrl = slug ? `/chooser?tenant=${slug}` : '/chooser';
  const adminUrl = slug ? `/admin?tenant=${slug}` : '/admin';

  // Build dynamic navigation items based on active modules
  const NAV_ITEMS: NavItem[] = [
    {
      label: isPlatformRoot ? 'Platform Overview' : 'About School',
      href: '/#about',
      dropdown: isPlatformRoot
        ? [
            { label: 'Autonomous OS Architecture', href: '/#about', desc: 'Distributed multi-tenant Next.js & Go architecture' },
            { label: 'Instant Provisioning Engine', href: '/maker', desc: 'Subdomain generation and module setup in 60 seconds' },
            { label: 'Security & Edge Guard', href: '/#features', desc: '256-bit cryptographic auth and role-based access' },
          ]
        : [
            { label: "Principal's Desk", href: '/#about', desc: `Welcome to ${schoolName}` },
            { label: 'Institutional Profile', href: '/#about', desc: `${board} Affiliated • ${tenant?.teacher_count || 48} Faculty Members` },
            { label: 'School Maker Studio', href: '/maker', desc: 'Reconfigure or provision another school' },
          ],
    },
    {
      label: 'Academics',
      href: '/academics',
      dropdown: [
        { label: 'Curriculum & Streams', href: '/academics', desc: 'Comprehensive secondary and senior secondary programs' },
        ...(isModuleEnabled('exams') ? [{ label: 'Board Examination Results', href: '/exams', desc: 'Terminal grade sheets & performance reports' }] : []),
        ...(isModuleEnabled('diary') ? [{ label: 'Homework & Daily Diary', href: '/diary', desc: 'Digital homework receipts & teacher remarks' }] : []),
        ...(isModuleEnabled('attendance') ? [{ label: 'Attendance System', href: '/attendance', desc: 'Biometric & period-wise statutory attendance' }] : []),
      ],
    },
    {
      label: 'Campus Logistics',
      href: '/facilities',
      dropdown: [
        ...(isModuleEnabled('bus') ? [{ label: 'Bus GPS Radar', href: '/bus', desc: 'Live route telemetry & supervisor contacts' }] : []),
        ...(isModuleEnabled('canteen') ? [{ label: 'Smart RFID Canteen', href: '/canteen', desc: 'Cashless meal wallet & dietary tracking' }] : []),
        ...(isModuleEnabled('library') ? [{ label: 'Digital Library', href: '/library', desc: 'Online catalog & automated book reservation' }] : []),
        ...(isModuleEnabled('health') ? [{ label: 'Health Infirmary', href: '/health', desc: 'Campus clinic records & vital telemetry' }] : []),
      ],
    },
    {
      label: 'Explore Campuses',
      href: '/explore',
      badge: 'Directory',
    },
  ];

  return (
    <header className="w-full select-none z-50 relative font-sans">
      {/* ============================================================ */}
      {/* DESKTOP TIER 1: OFFICIAL INSTITUTIONAL GAZETTE & AFFILIATION BAR */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* DESKTOP TIER 1: OFFICIAL INSTITUTIONAL GAZETTE & AFFILIATION BAR */}
      {/* ============================================================ */}
      <div className="hidden lg:block bg-oxford dark:bg-[#070913] text-slate-300 dark:text-slate-400 text-xs py-2 px-6 border-b border-slate-700/60 dark:border-[#1a1d2e] transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Official Affiliation Line */}
          <div className="flex items-center space-x-3 text-slate-300 dark:text-slate-300">
            {isPlatformRoot ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                NexaCampus Autonomous OS Platform
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold text-[11px] border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                AFFILIATED TO {board.toUpperCase()}
              </span>
            )}
            <span className="text-slate-500">•</span>
            <span className="font-mono text-[11px] text-slate-200 dark:text-slate-300">
              {isPlatformRoot ? 'Instant Subdomain Provisioning in 60s' : (slug ? `Tenant: ${slug}` : 'Campus System')}
            </span>
            {tenant && (
              <>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-[11px] text-slate-200 dark:text-slate-300">{tenant.city}, {tenant.state_territory}</span>
              </>
            )}
          </div>

          {/* Institutional Contact & Quick Access Portals */}
          <div className="flex items-center space-x-4 text-[11px]">
            {!isPlatformRoot && (
              <>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{phone}</span>
                </a>
                <span className="text-slate-600 dark:text-slate-700">|</span>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{email}</span>
                </a>
                <span className="text-slate-600 dark:text-slate-700">|</span>
              </>
            )}
            <Link
              href="/maker"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <span>School Maker Studio</span>
              <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1 rounded">Build OS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP TIER 2: STATELY INSTITUTIONAL CREST & MAIN NAVIGATION */}
      {/* ============================================================ */}
      <div
        className={`bg-white dark:bg-[#0c0e17] border-b border-slate-200 dark:border-[#1e2235] transition-colors duration-200 ${
          isScrolled ? 'shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] sticky top-0 z-40' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Institutional Crest and Seal */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <LogoEmblem className="h-11 w-11 drop-shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg md:text-xl text-oxford dark:text-white tracking-tight leading-tight">
                  {schoolName}
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-[#181c2e] text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-[#282e4a]">
                  {isPlatformRoot ? 'Platform Root' : (tenant?.city || 'Campus')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                {isPlatformRoot ? 'Autonomous Campus Operating System' : `${board} Higher Secondary Institution`}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links — HIDDEN ON /chooser */}
          {!isChooserRoute && (
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
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-oxford dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#181c2e] rounded-md transition-colors"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-burgundy/10 dark:bg-rose-500/20 text-burgundy dark:text-rose-300 border border-burgundy/20 dark:border-rose-500/30">
                          {item.badge}
                        </span>
                      )}
                      {hasDropdown && (
                        <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {/* Mega-Dropdown Menu */}
                    {hasDropdown && (
                      <div
                        className={`absolute left-0 top-full pt-2 w-80 transition-all duration-200 z-50 ${
                          activeDropdown === item.label
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                        }`}
                      >
                        <div className="bg-white dark:bg-[#121422] rounded-xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-slate-200/80 dark:border-[#23273e] p-2.5 overflow-hidden">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 border-b border-slate-100 dark:border-[#1e2338] mb-1">
                            {item.label}
                          </div>
                          {item.dropdown!.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1c2035] transition-colors group/sub"
                            >
                              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover/sub:text-[#1c2ac8] dark:group-hover/sub:text-[#7b89ff]">
                                {sub.label}
                              </div>
                              {sub.desc && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
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
          )}

          {/* Desktop Right Action Hub */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <DarkModeToggle className="w-8 h-8" />
            <Link
              href={signInUrl}
              className="px-3.5 py-2 text-xs font-semibold text-oxford dark:text-slate-200 bg-slate-100 dark:bg-[#191d30] hover:bg-slate-200 dark:hover:bg-[#232842] rounded-md transition-colors border border-slate-300 dark:border-[#2d3353]"
            >
              Sign In
            </Link>
            {isPlatformRoot ? (
              <Link
                href="/maker"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1c2ac8] hover:bg-[#15209e] rounded-md shadow-sm transition-all"
              >
                <span>Launch School App</span>
                <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <Link
                href={adminUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-oxford dark:bg-[#1a2038] hover:bg-slate-800 dark:hover:bg-[#242c4c] rounded-md shadow-sm transition-all border border-oxford dark:border-[#2f3962]"
              >
                <span>Admin Portal</span>
                <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}

            {/* ONLY FOR SCHOOL: 3-Bars Hamburger Button on Top Right */}
            {!isPlatformRoot && (
              <button
                type="button"
                onClick={() => setSchoolDrawerOpen(true)}
                className="w-9 h-9 rounded-md flex items-center justify-center bg-slate-100 dark:bg-[#191d30] hover:bg-slate-200 dark:hover:bg-[#232842] text-oxford dark:text-white border border-slate-300 dark:border-[#2d3353] transition-colors ml-1 cursor-pointer"
                title="School Navigation & Logistics"
                aria-label="Open school navigation menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Viewport Toggle */}
          <div className="lg:hidden flex items-center space-x-2">
            <DarkModeToggle className="w-8 h-8" />
            {!isPlatformRoot && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-xs font-bold"
                aria-label="Call school helpline"
              >
                <svg className="w-3 h-3 text-red-600 dark:text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Helpline</span>
              </a>
            )}

            <button
              onClick={() => (!isPlatformRoot ? setSchoolDrawerOpen(true) : setMobileMenuOpen(!mobileMenuOpen))}
              className="p-2 rounded-md text-oxford dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1c2035] transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileMenuOpen || schoolDrawerOpen}
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
      {/* MOBILE COLLAPSIBLE DRAWER                                     */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f111a] w-full max-h-[85vh] rounded-b-2xl shadow-2xl overflow-y-auto p-5 border-b border-slate-200 dark:border-[#20253b]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1c2035]">
              <div className="flex items-center gap-2.5">
                <LogoEmblem className="h-8 w-8 flex-shrink-0" />
                <div>
                  <div className="font-serif font-bold text-sm text-oxford dark:text-white">{schoolName}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {isPlatformRoot ? 'Platform Root' : `${board} Affiliated`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!isChooserRoute && (
              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="py-1">
                    <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#181c2e]">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-semibold text-sm text-slate-800 dark:text-slate-200"
                      >
                        {item.label}
                      </Link>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-burgundy/10 dark:bg-rose-500/20 text-burgundy dark:text-rose-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.dropdown && (
                      <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-100 dark:border-[#20253b]">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-oxford dark:hover:text-white"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1c2035] space-y-2">
              <Link
                href={signInUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-oxford dark:bg-[#1c223c] hover:bg-slate-800 dark:hover:bg-[#262e50] rounded-md block shadow-sm border border-transparent dark:border-[#303960]"
              >
                Sign In
              </Link>
              <Link
                href="/maker"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-md block"
              >
                School Maker Studio
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* School-Specific Navigation & Logistics Slide-Over Drawer */}
      <SchoolNavDrawer
        isOpen={schoolDrawerOpen}
        onClose={() => setSchoolDrawerOpen(false)}
      />
    </header>
  );
}
