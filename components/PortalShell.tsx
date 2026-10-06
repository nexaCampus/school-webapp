'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoEmblem from './LogoEmblem';
import { getSession } from '@/lib/session';

interface PortalShellProps {
  title: string;
  subtitle?: string;
  activePath?: string;
  children: React.ReactNode;
}

// Clean desktop navigation: Profile & Attendance removed per user requirements
// - Profile is accessed via the "Rajen Shaw" user pill on the top right
// - Attendance is integrated into /profile (and accessible via Services dropdown)
const PRIMARY_NAV = [
  { label: 'Home', href: '/home', icon: 'grid_view', path: 'home' },
  { label: 'Academics', href: '/academics', icon: 'menu_book', path: 'academics' },
  { label: 'Timetable', href: '/timetable', icon: 'calendar_month', path: 'timetable' },
  { label: 'Notices', href: '/notices', icon: 'campaign', path: 'notices' },
];

const MORE_SERVICES = [
  { label: 'Attendance Tracker', href: '/attendance', icon: 'event_available' },
  { label: 'Homework & Diary', href: '/diary', icon: 'auto_stories' },
  { label: 'Exams & Results', href: '/exams', icon: 'workspace_premium' },
  { label: 'Digital Library', href: '/library', icon: 'local_library' },
  { label: 'Bus Tracking', href: '/bus', icon: 'directions_bus' },
  { label: 'Canteen & Food', href: '/canteen', icon: 'restaurant' },
  { label: 'School Clubs', href: '/clubs', icon: 'groups' },
  { label: 'Hall Pass', href: '/hallpass', icon: 'badge' },
  { label: 'Health Clinic', href: '/health', icon: 'local_hospital' },
  { label: 'Parent Desk', href: '/helpdesk', icon: 'support_agent' },
  { label: 'Campus Store', href: '/store', icon: 'storefront' },
  { label: 'Photo Gallery', href: '/gallery', icon: 'photo_library' },
  { label: 'Lost & Found', href: '/lostfound', icon: 'search' },
  { label: 'Merits & Badges', href: '/merits', icon: 'military_tech' },
  { label: 'PTM Meetings', href: '/ptm', icon: 'groups_2' },
];

export default function PortalShell({
  title,
  subtitle = 'High School Portal',
  activePath,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const [studentName, setStudentName] = useState('Student');
  const [gradeSection, setGradeSection] = useState('Senior Wing');
  const [servicesOpen, setServicesOpen] = useState(false);

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
    <div className="relative min-h-screen bg-surface flex flex-col">
      {/* DESKTOP HEADER (>= 768px): Sleek, properly-aligned executive top bar */}
      <header className="hidden md:block sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
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

            {/* Services Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  servicesOpen
                    ? 'bg-surface-container-high text-primary'
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
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setServicesOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_16px_40px_rgba(28,42,200,0.14)] border border-outline/10 p-2 z-50 grid grid-cols-1 gap-0.5 max-h-[70vh] overflow-y-auto">
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
                        <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                        </span>
                        <span className="font-medium">{s.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Action: Student Pill (links to /profile) & Switch Account button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Profile Pill: Clicking on Rajen Shaw opens /profile */}
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

      {/* MOBILE HEADER (< 768px): Exact original mobile header look */}
      <header className="md:hidden fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0 flex-1">
            <LogoEmblem className="h-8 w-8" />
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">
                {subtitle}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                {title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 md:pt-6 md:pb-24 bg-surface">
        <div className="w-full max-w-6xl mx-auto px-margin md:px-8 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* MOBILE FLOATING PILL NAVBAR (< 768px): Exact original mobile look */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe pointer-events-none">
        <div className="px-margin pb-space-md pt-space-xs pointer-events-auto max-w-[430px] mx-auto">
          <div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between">
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
