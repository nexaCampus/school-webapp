'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoEmblem from './LogoEmblem';
import PortalFooter from './PortalFooter';
import DarkModeToggle from './DarkModeToggle';
import { getSession } from '@/lib/session';

interface PortalShellProps {
  title: string;
  subtitle?: string;
  activePath?: string;
  children: React.ReactNode;
}

// Clean desktop navigation
const PRIMARY_NAV = [
  { label: 'Home', href: '/home', icon: 'grid_view', path: 'home' },
  { label: 'Academics', href: '/academics', icon: 'menu_book', path: 'academics' },
  { label: 'Timetable', href: '/timetable', icon: 'calendar_month', path: 'timetable' },
  { label: 'Notices', href: '/notices', icon: 'campaign', path: 'notices' },
];

const MORE_SERVICES = [
  { label: 'Attendance Tracker', href: '/attendance', icon: 'event_available', desc: 'Daily & monthly log' },
  { label: 'Homework & Diary', href: '/diary', icon: 'auto_stories', desc: 'Class assignments' },
  { label: 'Exams & Results', href: '/exams', icon: 'workspace_premium', desc: 'Report cards & marks' },
  { label: 'Digital Library', href: '/library', icon: 'local_library', desc: 'Catalog & book issues' },
  { label: 'Bus Tracking', href: '/bus', icon: 'directions_bus', desc: 'Live route tracking' },
  { label: 'Canteen & Food', href: '/canteen', icon: 'restaurant', desc: 'Daily menu & token' },
  { label: 'School Clubs', href: '/clubs', icon: 'groups', desc: 'Extracurricular activities' },
  { label: 'Hall Pass', href: '/hallpass', icon: 'badge', desc: 'Digital gate passes' },
  { label: 'Health Clinic', href: '/health', icon: 'local_hospital', desc: 'Medical room records' },
  { label: 'Parent Desk', href: '/helpdesk', icon: 'support_agent', desc: 'Grievance & helpdesk' },
  { label: 'Campus Store', href: '/store', icon: 'storefront', desc: 'Uniforms & stationery' },
  { label: 'Photo Gallery', href: '/gallery', icon: 'photo_library', desc: 'Annual events & sports' },
  { label: 'Lost & Found', href: '/lostfound', icon: 'search', desc: 'Reported campus items' },
  { label: 'Merits & Badges', href: '/merits', icon: 'military_tech', desc: 'Honors & points' },
  { label: 'PTM Meetings', href: '/ptm', icon: 'groups_2', desc: 'Teacher conference slots' },
  { label: 'Timetable', href: '/timetable', icon: 'calendar_month', desc: 'Class period schedule' },
];

export default function PortalShell({
  title,
  subtitle = 'LCGVM',
  activePath,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const [studentName, setStudentName] = useState('Student');
  const [gradeSection, setGradeSection] = useState('Senior Wing');
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close Desktop Services dropdown when clicking outside
  useEffect(() => {
    if (!servicesOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setServicesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [servicesOpen]);

  // Support hardware/browser back button to dismiss the mobile full-screen hamburger
  useEffect(() => {
    if (!mobileServicesOpen) return;

    const handlePopState = () => {
      setMobileServicesOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [mobileServicesOpen]);

  const openMobileServices = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ servicesMenuOpen: true }, '');
    }
    setMobileServicesOpen(true);
  };

  const closeMobileServices = () => {
    if (typeof window !== 'undefined' && window.history.state?.servicesMenuOpen) {
      window.history.back();
    } else {
      setMobileServicesOpen(false);
    }
  };

  // Auto-close on route change
  useEffect(() => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const s = getSession();
    if (s?.student) {
      const name = s.student.displayName || s.student.name || s.name;
      if (name) setStudentName(name);
      if (s.student.grade && s.student.section) {
        setGradeSection(`${s.student.grade} - ${s.student.section}`);
      }
    } else if (s?.name) {
      setStudentName(s.name);
    }
  }, []);

  const currentPath = activePath || pathname.replace(/^\//, '') || 'home';

  return (
    <div className="relative min-h-screen bg-surface flex flex-col max-w-full overflow-x-hidden">
      {/* DESKTOP HEADER (>= 768px): Sleek, properly-aligned executive top bar */}
      <header className="hidden md:block sticky top-0 w-full z-50 bg-surface/90 dark:bg-[#0b0f19]/90 backdrop-blur-xl border-b border-outline/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Brand Identity */}
          <Link href="/home" className="flex items-center gap-3 group flex-shrink-0">
            <LogoEmblem className="h-9 w-9 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider font-semibold">
                {subtitle}
              </span>
              <span className="font-headline-sm text-[17px] text-on-surface font-bold truncate">
                {title}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-2 flex-1 justify-center max-w-xl">
            {PRIMARY_NAV.map((item) => {
              const isActive =
                currentPath === item.path ||
                pathname === item.href ||
                (item.path === 'home' && pathname === '/');
              return (
                <Link
                  key={item.path}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Desktop Services Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  servicesOpen
                    ? 'bg-surface-container-high text-primary ring-2 ring-primary/20'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">apps</span>
                <span>Services</span>
                <span className="material-symbols-outlined text-[16px] transition-transform">
                  {servicesOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {servicesOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-surface-container-lowest/98 dark:bg-[#121929]/98 backdrop-blur-xl shadow-[0_16px_40px_rgba(28,42,200,0.14)] border border-outline/10 p-2 z-50 grid grid-cols-1 gap-0.5 max-h-[70vh] overflow-y-auto">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-outline border-b border-outline/10 mb-1">
                    All Student Services
                  </div>
                  {MORE_SERVICES.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-surface-container dark:bg-slate-800 flex items-center justify-center text-primary dark:text-primary-fixed">
                        <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                      </span>
                      <span className="font-medium">{s.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action: Dark Mode (left of Profile) & Student Pill */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Dark Mode toggle: Placed on the LEFT of the Profile Icon */}
            <DarkModeToggle />

            {/* Profile Pill: Clicking opens /profile */}
            <Link
              href="/profile"
              title="View Student Profile"
              className={`flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full border transition-all ${
                pathname === '/profile'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface-container border-transparent hover:bg-surface-container-high text-on-surface'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-[14px] shadow-sm">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-bold text-on-surface leading-tight">
                  {studentName}
                </span>
                <span className="text-[10px] text-primary font-semibold leading-none">
                  {gradeSection}
                </span>
              </div>
            </Link>

            {/* Switch Account / Logout */}
            <Link
              href="/chooser"
              title="Switch user or portal mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER (< 768px): With Hamburger on Top Left & Dark Mode to the Left of Profile */}
      <header className="md:hidden fixed top-0 w-full z-40 pt-safe bg-surface/90 dark:bg-[#0b0f19]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline/10">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
          {/* Top Left: Hamburger menu button + School Emblem & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={openMobileServices}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-transform flex-shrink-0"
              aria-label="Open School Services menu"
              title="Open Services"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <LogoEmblem className="h-8 w-8 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold truncate">
                {subtitle}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                {title}
              </span>
            </div>
          </div>

          {/* Top Right: Dark Mode Toggle to the LEFT of Profile Icon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <DarkModeToggle />
            <Link
              href="/profile"
              title="My Profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE HAMBURGER MENU: Coming from Top to Entire Bottom with Cross Button on Top Right */}
      {mobileServicesOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-surface dark:bg-[#0b0f19] flex flex-col animate-in fade-in slide-in-from-top-6 duration-200">
          {/* Top Bar inside Full-Screen Hamburger */}
          <div className="h-16 px-margin pt-safe flex items-center justify-between border-b border-outline/10 bg-surface/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <LogoEmblem className="h-8 w-8" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary block">
                  LCGVM Campus Gateway
                </span>
                <span className="text-[16px] font-extrabold text-on-surface block leading-tight">
                  All School Services
                </span>
              </div>
            </div>

            {/* Cross Button on the Top Right */}
            <button
              type="button"
              onClick={closeMobileServices}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container dark:bg-slate-800 text-on-surface hover:bg-surface-container-high active:scale-90 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Body: 1 Row has 2 Blocks (grid-cols-2) with Proper Service Icons */}
          <div className="flex-1 overflow-y-auto px-4 py-5 pb-safe">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
                  Select Campus Service
                </span>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  16 Modules Available
                </span>
              </div>

              {/* Grid: Exactly 2 blocks per row */}
              <div className="grid grid-cols-2 gap-3">
                {MORE_SERVICES.map((s) => {
                  const isActive = pathname === s.href;
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={closeMobileServices}
                      className={`p-3.5 rounded-2xl border transition-all duration-150 flex flex-col items-start gap-2 active:scale-95 shadow-sm ${
                        isActive
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface-container-lowest dark:bg-[#121929] border-outline/10 hover:border-primary/40 text-on-surface'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-high dark:bg-slate-800 text-primary dark:text-primary-fixed'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                      </div>
                      <div className="min-w-0 w-full">
                        <span className="text-[13px] font-bold text-on-surface block truncate">
                          {s.label}
                        </span>
                        <span className="text-[10px] text-outline block truncate mt-0.5">
                          {s.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Quick links footer inside hamburger */}
              <div className="mt-6 pt-4 border-t border-outline/10 flex items-center justify-between text-[11px] text-outline px-1">
                <Link
                  href="/profile"
                  onClick={closeMobileServices}
                  className="flex items-center gap-1.5 text-on-surface hover:text-primary font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  <span>My Student Profile</span>
                </Link>
                <Link
                  href="/chooser"
                  onClick={closeMobileServices}
                  className="flex items-center gap-1.5 text-error font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Switch Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-8 md:pt-6 md:pb-12 bg-surface">
        <div className="w-full max-w-6xl mx-auto px-margin md:px-8 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* INSTITUTIONAL PORTAL FOOTER */}
      <PortalFooter />

      {/* MOBILE FLOATING PILL NAVBAR (< 768px): Exact original mobile look */}
      <nav className="md:hidden fixed bottom-0 w-full z-30 pb-safe pointer-events-none">
        <div className="px-margin pb-space-md pt-space-xs pointer-events-auto max-w-[430px] mx-auto">
          <div className="bg-white/95 dark:bg-[#121929]/95 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(59,73,223,0.08)] border border-outline/10 p-space-xs flex items-center justify-between">
            <Link
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 ${
                currentPath === 'home' || pathname === '/home' || pathname === '/'
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              href="/home"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span className="font-label-sm text-label-sm mt-0.5">Home</span>
            </Link>
            <Link
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 ${
                currentPath === 'academics' || pathname === '/academics'
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              href="/academics"
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              <span className="font-label-sm text-label-sm mt-0.5">Academics</span>
            </Link>
            <Link
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full transition-all duration-200 ${
                currentPath === 'notices' || pathname === '/notices'
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              href="/notices"
            >
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              <span className="font-label-sm text-label-sm mt-0.5">Notices</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
