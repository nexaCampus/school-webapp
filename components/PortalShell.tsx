'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LogoEmblem from './LogoEmblem';
import PortalFooter from './PortalFooter';
import DarkModeToggle from './DarkModeToggle';
import NotificationPrompt from './NotificationPrompt';
import { Modal } from './common/Modal';
import { ErrorBoundary } from './feedback/ErrorBoundary';
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
  { label: 'Campus Homepage', href: '/', icon: 'domain', desc: 'Executive 15-section portal' },
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
    setShowLogoutModal(false);
    setIsProcessingAuth(true);
    await logoutUser('/chooser');
  };

  const handlePerformSwitch = async () => {
    setShowSwitchModal(false);
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

  const closeMobileServices = () => {
    setMobileServicesOpen(false);
  };

  const navigateToService = (href: string) => {
    setMobileServicesOpen(false);
    router.push(href);
  };

  // Auto-close on route change
  useEffect(() => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Prefetch primary mobile tabs and services for instantaneous navigation
  useEffect(() => {
    router.prefetch('/home');
    router.prefetch('/academics');
    router.prefetch('/notices');
    router.prefetch('/profile');
    MORE_SERVICES.forEach((s) => {
      router.prefetch(s.href);
    });
  }, [router]);

  useEffect(() => {
    const verifySession = () => {
      const s = getSession();
      if (!s?.student && !s?.name) {
        setShowLogoutModal(false);
        setShowSwitchModal(false);
        setIsProcessingAuth(false);
        window.location.replace('/chooser');
        return false;
      }
      const name = s.student?.displayName || s.student?.name || s.name;
      if (name) setStudentName(name);
      if (s.student?.grade && s.student?.section) {
        setGradeSection(`${s.student.grade} - ${s.student.section}`);
      }
      return true;
    };

    verifySession();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || !getSession()) {
        setShowLogoutModal(false);
        setShowSwitchModal(false);
        setIsProcessingAuth(false);
        window.location.replace('/chooser');
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${title} | NexaCampus School`;
    }
  }, [title]);

  const currentPath = activePath || pathname.replace(/^\//, '') || 'home';
  const firstName = studentName ? studentName.trim().split(/\s+/)[0] : 'Student';

  // Mobile Touch Gestures (< 768px):
  // Strictly Horizontal Swipe: Home <-> Academics <-> Notices
  // Vertical scrolling (scrolling up/down) is 100% untouched and unhindered.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
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
      if (mobileServicesOpen || showLogoutModal || showSwitchModal) {
        isIgnoredTarget = true;
        return;
      }
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();

      // Do not intercept inputs, bottom navigation, or horizontal scrollers
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
      if (isIgnoredTarget) return;

      // Do not trigger page swipe if modals or mobile menu are active
      if (mobileServicesOpen || showLogoutModal || showSwitchModal) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const duration = Date.now() - touchStartTime;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // CRITICAL: If vertical displacement exceeds 30px, the user is scrolling up/down the page.
      // Immediately abort to preserve completely native, fluid vertical scrolling!
      if (absY > 30) return;

      // Must be a decisive horizontal swipe flick (>= 65px horizontally, within 500ms)
      if (absX >= 65 && absX > absY * 2.0 && duration < 500) {
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
      <header className="hidden md:block sticky top-0 w-full z-50 bg-surface/90 dark:bg-[#151622]/90 backdrop-blur-xl border-b border-outline/10 dark:border-[#222538] shadow-sm">
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
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-[#222538]'
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
                    ? 'bg-surface-container-high dark:bg-[#222538] text-primary ring-2 ring-primary/20'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-[#222538]'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">apps</span>
                <span>Services</span>
                <span className="material-symbols-outlined text-[16px] transition-transform">
                  {servicesOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {servicesOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#151622] shadow-2xl border border-outline/15 dark:border-[#222538] p-2 z-50 grid grid-cols-1 gap-0.5 max-h-[70vh] overflow-y-auto opacity-100">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-outline border-b border-outline/10 dark:border-[#222538] mb-1">
                    All Student Services
                  </div>
                  {MORE_SERVICES.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container dark:hover:bg-[#222538] transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-surface-container dark:bg-[#101119] flex items-center justify-center text-primary dark:text-[#bdc2ff]">
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
              title={`View Student Profile (${studentName})`}
              className={`flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full border transition-all ${
                pathname === '/profile'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface-container dark:bg-[#151622] border-transparent dark:border-[#222538] hover:bg-surface-container-high dark:hover:bg-[#222538] text-on-surface'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-[14px] shadow-sm">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-bold text-on-surface leading-tight">
                  {firstName}
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
      <header className="md:hidden fixed top-0 w-full z-40 pt-safe bg-surface/90 dark:bg-[#151622]/90 backdrop-blur-xl shadow-[0_1px_6px_rgba(0,0,0,0.15)] border-b border-outline/10 dark:border-[#222538]">
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
            <Link href="/home" title="Go to Home" className="flex-shrink-0 flex items-center">
              <LogoEmblem className="h-7 w-7" />
            </Link>
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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All School Services"
          className="md:hidden fixed inset-0 z-50 bg-white dark:bg-[#12131a] flex flex-col animate-in fade-in slide-in-from-top-6 duration-200"
        >
          {/* Top Bar inside Full-Screen Hamburger */}
          <div className="h-14 px-3 pt-safe flex items-center justify-between border-b border-outline/10 dark:border-[#222538] bg-white dark:bg-[#151622] flex-shrink-0">
            <div className="flex items-center gap-2">
              <Link href="/home" onClick={closeMobileServices} title="Go to Home" className="flex items-center">
                <LogoEmblem className="h-7 w-7" />
              </Link>
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
              className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container dark:bg-[#1a1c2b] dark:border dark:border-[#222538] text-on-surface hover:bg-surface-container-high dark:hover:bg-[#222538] active:scale-90 transition-all shadow-sm cursor-pointer z-30"
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
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToService(s.href);
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex flex-col items-start gap-1.5 active:scale-95 shadow-sm cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-white dark:bg-[#151622] border-outline/10 dark:border-[#222538] hover:border-primary/40 dark:hover:bg-[#1a1c2b] text-on-surface'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-high dark:bg-[#101119] text-primary dark:text-[#bdc2ff]'
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
              <div className="mt-6 pt-4 border-t border-outline/10 dark:border-[#222538] flex items-center justify-between text-[11px] text-outline px-1">
                <Link
                  href="/profile"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToService('/profile');
                  }}
                  className="flex items-center gap-1.5 text-on-surface hover:text-primary font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  <span>My Student Profile</span>
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileServicesOpen(false);
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
                      setMobileServicesOpen(false);
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
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Log Out?"
        description={`You will be signed out of ${studentName}. You can sign back in anytime using your admission number or registered credentials.`}
        icon="logout"
        iconColor="text-error"
        iconBg="bg-error/15"
        confirmText="Yes, Log Out"
        cancelText="Cancel & Stay"
        confirmVariant="danger"
        onConfirm={handlePerformLogout}
        isBusy={isProcessingAuth}
        busyText="Logging out..."
      />

      {/* Switch Account Modal */}
      <Modal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        title="Switch Student Account?"
        description="Switch to another student admission number, sibling, or guardian profile. Your current timetable and diary records will remain securely cached."
        icon="switch_account"
        iconColor="text-primary"
        iconBg="bg-primary/15"
        confirmText="Switch Account"
        cancelText="Cancel"
        confirmVariant="primary"
        onConfirm={handlePerformSwitch}
        isBusy={isProcessingAuth}
        busyText="Switching..."
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative w-full pt-14 pb-14 md:pt-6 md:pb-12 bg-surface">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 flex-1 flex flex-col">
          <div className="mb-3.5">
            <NotificationPrompt variant="banner" />
          </div>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* INSTITUTIONAL PORTAL FOOTER */}
      <PortalFooter />

      {/* MOBILE FLOATING PILL NAVBAR (< 768px): Refined & proportional to phone UI */}
      <nav className="md:hidden fixed bottom-0 w-full z-30 pb-safe pointer-events-none">
        <div className="px-3 pb-2 pt-0.5 pointer-events-auto max-w-[340px] mx-auto">
          <div className="bg-white/95 dark:bg-[#151622]/95 backdrop-blur-2xl rounded-full shadow-[0_8px_20px_-4px_rgba(0,0,0,0.35)] border border-outline/10 dark:border-[#222538] p-1 flex items-center justify-between">
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
