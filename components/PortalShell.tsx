'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LogoEmblem from './LogoEmblem';
import PortalFooter from './PortalFooter';
import DarkModeToggle from './DarkModeToggle';
import { getSession, logoutUser, switchAccount } from '@/lib/session';

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
  const router = useRouter();
  const [studentName, setStudentName] = useState('Student');
  const [gradeSection, setGradeSection] = useState('Senior Wing');
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const handlePerformLogout = async () => {
    setIsProcessingAuth(true);
    await logoutUser('/chooser');
  };

  const handlePerformSwitch = async () => {
    setIsProcessingAuth(true);
    await switchAccount();
  };

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

  // Close mobile hamburger menu on Escape key
  useEffect(() => {
    if (!mobileServicesOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileServicesOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileServicesOpen]);

  // Lock body scroll while full-screen mobile menu is open
  useEffect(() => {
    if (mobileServicesOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileServicesOpen]);

  const toggleServices = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setServicesOpen((prev) => !prev);
  };

  const openMobileServices = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileServicesOpen(true);
  };

  const closeMobileServices = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileServicesOpen(false);
  };

  // Auto-close on route change
  useEffect(() => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Prefetch primary mobile tabs for instantaneous swipe navigation
  useEffect(() => {
    router.prefetch('/home');
    router.prefetch('/academics');
    router.prefetch('/notices');
  }, [router]);

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

  // Mobile Touch Gestures (< 768px):
  // 1. Swipe Right-to-Left: Home -> Academics -> Notices
  // 2. Swipe Left-to-Right: Notices -> Academics -> Home
  // 3. Swipe Top-to-Bottom / Mid-to-Bottom: Open full-screen Hamburger drawer
  // 4. Swipe Bottom-to-Top (inside Hamburger): Close Hamburger drawer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let scrollStartY = 0;
    let isIgnoredTarget = false;

    const isHorizontalScrollable = (target: EventTarget | null): boolean => {
      let el = target as HTMLElement | null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowX = style.overflowX;
        if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 5) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      scrollStartY = window.scrollY || document.documentElement.scrollTop || 0;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();

      // Do not intercept form inputs, buttons in bottom nav, or horizontal scrolling carousels
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.closest('nav')) {
        isIgnoredTarget = true;
        return;
      }

      if (isHorizontalScrollable(target)) {
        isIgnoredTarget = true;
        return;
      }

      isIgnoredTarget = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      if (e.changedTouches.length !== 1) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const duration = Date.now() - touchStartTime;

      // Ignore micro-taps or prolonged holds
      if (duration > 750 || duration < 40) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // If mobile hamburger menu is OPEN:
      if (mobileServicesOpen) {
        // Swiping UP (bottom to top, deltaY < -50) closes it
        if (deltaY < -50 && absY > absX * 1.3) {
          setMobileServicesOpen(false);
        }
        return;
      }

      // If auth modals are open, do not trigger gestures
      if (showLogoutModal || showSwitchModal) return;

      // 1. VERTICAL SWIPE DOWN (Top to Bottom / Mid to Bottom): Open Hamburger Menu
      if (deltaY > 55 && absY > absX * 1.3) {
        if ((scrollStartY <= 30 || touchStartY <= 65) && touchStartY <= window.innerHeight * 0.75) {
          setMobileServicesOpen(true);
          return;
        }
      }

      // 2. HORIZONTAL SWIPE: Tab switching between Home <-> Academics <-> Notices
      if (isIgnoredTarget) return;

      if (absX > 55 && absX > absY * 1.35) {
        const path = currentPath === '/' ? 'home' : currentPath;

        // Swipe RIGHT-TO-LEFT (deltaX < 0): Move forward
        // Home -> Academics -> Notices
        if (deltaX < 0) {
          if (path === 'home') {
            router.push('/academics');
          } else if (path === 'academics') {
            router.push('/notices');
          }
        }
        // Swipe LEFT-TO-RIGHT (deltaX > 0): Move backward
        // Notices -> Academics -> Home
        else if (deltaX > 0) {
          if (path === 'notices') {
            router.push('/academics');
          } else if (path === 'academics') {
            router.push('/home');
          }
        }
      }
    };

    const handleTouchCancel = () => {
      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
      isIgnoredTarget = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [currentPath, mobileServicesOpen, showLogoutModal, showSwitchModal, router]);

  return (
    <div className="relative min-h-screen bg-surface flex flex-col max-w-full overflow-x-hidden">
      {/* DESKTOP HEADER (>= 768px): Sleek, properly-aligned executive top bar */}
      <header className="hidden md:block sticky top-0 w-full z-50 bg-surface/90 dark:bg-[#181818]/95 backdrop-blur-xl border-b border-outline/10 dark:border-[#2d2d2d] shadow-sm">
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
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-[#2d2d2d]'
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
                onClick={toggleServices}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  servicesOpen
                    ? 'bg-surface-container-high dark:bg-[#2d2d2d] text-primary ring-2 ring-primary/20'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-[#2d2d2d]'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">apps</span>
                <span>Services</span>
                <span className="material-symbols-outlined text-[16px] transition-transform">
                  {servicesOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {servicesOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#252526] shadow-2xl border border-outline/15 dark:border-[#3c3c3c] p-2 z-50 grid grid-cols-1 gap-0.5 max-h-[70vh] overflow-y-auto opacity-100">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-outline border-b border-outline/10 dark:border-[#3c3c3c] mb-1">
                    All Student Services
                  </div>
                  {MORE_SERVICES.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container dark:hover:bg-[#2d2d2d] transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-surface-container dark:bg-[#1e1e1e] flex items-center justify-center text-primary dark:text-[#3794ff]">
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
                  : 'bg-surface-container dark:bg-[#252526] border-transparent dark:border-[#3c3c3c] hover:bg-surface-container-high dark:hover:bg-[#2d2d2d] text-on-surface'
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

            {/* Switch Account */}
            <button
              type="button"
              onClick={() => setShowSwitchModal(true)}
              title="Switch Student Account"
              aria-label="Switch Student Account"
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">switch_account</span>
            </button>

            {/* Log Out */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Log Out of NexaCampus"
              aria-label="Log Out of NexaCampus"
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER (< 768px): Compact & sleek with Hamburger on Top Left & Dark Mode to the Left of Profile */}
      <header className="md:hidden fixed top-0 w-full z-40 pt-safe bg-surface/90 dark:bg-[#181818]/95 backdrop-blur-xl shadow-[0_1px_6px_rgba(0,0,0,0.15)] border-b border-outline/10 dark:border-[#2d2d2d]">
        <div className="h-14 px-3 flex items-center justify-between gap-2">
          {/* Top Left: Hamburger menu button + School Emblem & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={openMobileServices}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-90 transition-transform flex-shrink-0 cursor-pointer z-30"
              aria-label="Open School Services menu"
              title="Open Services"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <LogoEmblem className="h-7 w-7 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-outline uppercase tracking-wider font-bold truncate leading-tight">
                {subtitle}
              </span>
              <span className="text-[15px] font-bold text-on-surface truncate leading-tight">
                {title}
              </span>
            </div>
          </div>

          {/* Top Right: Dark Mode Toggle to the LEFT of Profile Icon */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <DarkModeToggle className="w-8 h-8" />
            <Link
              href="/profile"
              title="My Profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-on-primary text-[17px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE HAMBURGER MENU: Coming from Top to Entire Bottom with Cross Button on Top Right */}
      {mobileServicesOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-[#1e1e1e] flex flex-col animate-in fade-in slide-in-from-top-6 duration-200">
          {/* Top Bar inside Full-Screen Hamburger */}
          <div className="h-14 px-3 pt-safe flex items-center justify-between border-b border-outline/10 dark:border-[#2d2d2d] bg-white dark:bg-[#181818] flex-shrink-0">
            <div className="flex items-center gap-2">
              <LogoEmblem className="h-7 w-7" />
              <div>
                <span className="text-[9.5px] uppercase font-bold tracking-widest text-primary block">
                  LCGVM Campus Gateway
                </span>
                <span className="text-[14.5px] font-extrabold text-on-surface block leading-tight">
                  All School Services
                </span>
              </div>
            </div>

            {/* Cross Button on the Top Right */}
            <button
              type="button"
              onClick={closeMobileServices}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container dark:bg-[#252526] dark:border dark:border-[#3c3c3c] text-on-surface hover:bg-surface-container-high dark:hover:bg-[#2d2d2d] active:scale-90 transition-all shadow-sm cursor-pointer z-30"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body: 1 Row has 2 Blocks (grid-cols-2) with Proper Service Icons */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 pb-safe">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-outline">
                  Select Campus Service
                </span>
                <span className="text-[9.5px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  16 Modules Available
                </span>
              </div>

              {/* Grid: Exactly 2 blocks per row */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {MORE_SERVICES.map((s) => {
                  const isActive = pathname === s.href;
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={closeMobileServices}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex flex-col items-start gap-1.5 active:scale-95 shadow-sm cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-white dark:bg-[#252526] border-outline/10 dark:border-[#3c3c3c] hover:border-primary/40 dark:hover:bg-[#2d2d2d] text-on-surface'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-high dark:bg-[#1e1e1e] text-primary dark:text-[#3794ff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[19px]">{s.icon}</span>
                      </div>
                      <div className="min-w-0 w-full">
                        <span className="text-[12px] font-bold text-on-surface block truncate">
                          {s.label}
                        </span>
                        <span className="text-[9.5px] text-outline block truncate mt-0.5">
                          {s.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Quick links footer inside hamburger */}
              <div className="mt-6 pt-4 border-t border-outline/10 dark:border-[#3c3c3c] flex items-center justify-between text-[11px] text-outline px-1">
                <Link
                  href="/profile"
                  onClick={closeMobileServices}
                  className="flex items-center gap-1.5 text-on-surface hover:text-primary font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  <span>My Student Profile</span>
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileServices();
                      setShowSwitchModal(true);
                    }}
                    className="flex items-center gap-1 text-primary font-semibold cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">switch_account</span>
                    <span>Switch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileServices();
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center gap-1 text-error font-semibold cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#252526] border border-outline/15 dark:border-[#3c3c3c] p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-error/15 text-error flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">logout</span>
            </div>
            <h3 className="text-[17px] font-bold text-on-surface mb-1.5">
              Confirm Log Out?
            </h3>
            <p className="text-[12px] text-on-surface-variant leading-relaxed mb-5">
              You will be signed out of <strong className="text-on-surface">{studentName}</strong>. You can sign back in anytime using your admission number or registered credentials.
            </p>
            <div className="flex flex-col w-full gap-2">
              <button
                type="button"
                disabled={isProcessingAuth}
                onClick={handlePerformLogout}
                className="w-full py-2.5 rounded-full bg-error text-white text-[13px] font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>{isProcessingAuth ? 'Logging out...' : 'Yes, Log Out'}</span>
              </button>
              <button
                type="button"
                disabled={isProcessingAuth}
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 rounded-full bg-surface-container-high dark:bg-[#333333] text-on-surface text-[13px] font-semibold hover:bg-surface-container-highest active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel &amp; Stay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Account Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#252526] border border-outline/15 dark:border-[#3c3c3c] p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">switch_account</span>
            </div>
            <h3 className="text-[17px] font-bold text-on-surface mb-1.5">
              Switch Student Account?
            </h3>
            <p className="text-[12px] text-on-surface-variant leading-relaxed mb-5">
              Switch to another student admission number, sibling, or guardian profile. Your current timetable and diary records will remain securely cached.
            </p>
            <div className="flex flex-col w-full gap-2">
              <button
                type="button"
                disabled={isProcessingAuth}
                onClick={handlePerformSwitch}
                className="w-full py-2.5 rounded-full bg-primary text-white text-[13px] font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>{isProcessingAuth ? 'Switching...' : 'Switch Account'}</span>
              </button>
              <button
                type="button"
                disabled={isProcessingAuth}
                onClick={() => setShowSwitchModal(false)}
                className="w-full py-2.5 rounded-full bg-surface-container-high dark:bg-[#333333] text-on-surface text-[13px] font-semibold hover:bg-surface-container-highest active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative w-full pt-14 pb-14 md:pt-6 md:pb-12 bg-surface">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* INSTITUTIONAL PORTAL FOOTER */}
      <PortalFooter />

      {/* MOBILE FLOATING PILL NAVBAR (< 768px): Refined & proportional to phone UI */}
      <nav className="md:hidden fixed bottom-0 w-full z-30 pb-safe pointer-events-none">
        <div className="px-3 pb-2 pt-0.5 pointer-events-auto max-w-[340px] mx-auto">
          <div className="bg-white/95 dark:bg-[#181818]/95 backdrop-blur-2xl rounded-full shadow-[0_8px_20px_-4px_rgba(0,0,0,0.35)] border border-outline/10 dark:border-[#3c3c3c] p-1 flex items-center justify-between">
            <Link
              className={`flex-1 min-h-[36px] flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all duration-200 ${
                currentPath === 'home' || pathname === '/home' || pathname === '/'
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              href="/home"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Home</span>
            </Link>
            <Link
              className={`flex-1 min-h-[36px] flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all duration-200 ${
                currentPath === 'academics' || pathname === '/academics'
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              href="/academics"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Academics</span>
            </Link>
            <Link
              className={`flex-1 min-h-[36px] flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all duration-200 ${
                currentPath === 'notices' || pathname === '/notices'
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              href="/notices"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Notices</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
