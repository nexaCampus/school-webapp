'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoEmblem from '@/components/LogoEmblem';
import DarkModeToggle from '@/components/DarkModeToggle';
import HeroTypewriter from '@/components/HeroTypewriter';
import RevealMore from '@/components/common/RevealMore';
import { getSession } from '@/lib/session';

// 16 Institutional Modules with categories and direct routes
interface ModuleItem {
  id: string;
  name: string;
  category: 'academics' | 'logistics' | 'studentlife' | 'admin';
  icon: string;
  badge: string;
  desc: string;
  href: string;
  accent: string;
}

const MODULES_DATA: ModuleItem[] = [
  {
    id: 'attendance',
    name: 'Attendance Tracker',
    category: 'academics',
    icon: 'event_available',
    badge: 'Daily & Monthly Log',
    desc: 'Real-time biometric & period-wise attendance records with 75% CISCE compliance tracking.',
    href: '/attendance',
    accent: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'diary',
    name: 'Homework & Diary',
    category: 'academics',
    icon: 'auto_stories',
    badge: 'Class Assignments',
    desc: 'Daily subject diary, teacher remarks, homework deadlines, and digital submission receipts.',
    href: '/diary',
    accent: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'exams',
    name: 'Exams & Results',
    category: 'academics',
    icon: 'workspace_premium',
    badge: 'Report Cards & Marks',
    desc: 'CISCE terminal grade sheets, digital admit cards, answer key previews, and score radar.',
    href: '/exams',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    id: 'library',
    name: 'Digital Library',
    category: 'academics',
    icon: 'local_library',
    badge: 'Book Issues & Catalog',
    desc: 'Search 12,000+ school volumes, check return dates, reserve bestsellers, and access e-books.',
    href: '/library',
    accent: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'canteen',
    name: 'Smart Canteen & RFID',
    category: 'logistics',
    icon: 'restaurant',
    badge: 'Cashless Dining',
    desc: 'RFID contactless wallet, daily spending ceilings, healthy menu orders, and instant pickup slips.',
    href: '/canteen',
    accent: 'from-amber-600 to-red-500',
  },
  {
    id: 'bus',
    name: 'School Bus GPS Radar',
    category: 'logistics',
    icon: 'directions_bus',
    badge: 'Live Route Tracking',
    desc: 'Live telemetry, geofenced proximity alerts, driver SOS channel, and real-time transit ETA.',
    href: '/bus',
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'hallpass',
    name: 'Digital Hall Pass',
    category: 'logistics',
    icon: 'badge',
    badge: 'Dynamic QR Security',
    desc: 'Encrypted time-limited transit permissions with staff approval and security turnstile validation.',
    href: '/hallpass',
    accent: 'from-purple-600 to-pink-600',
  },
  {
    id: 'clinic',
    name: 'Campus Health Clinic',
    category: 'logistics',
    icon: 'local_hospital',
    badge: 'Infirmary Profile',
    desc: 'Confidential allergy alerts, doctor visitation logs, vital telemetry, and emergency guardian dispatch.',
    href: '/health',
    accent: 'from-rose-500 to-red-600',
  },
  {
    id: 'store',
    name: 'Campus Store & Uniforms',
    category: 'logistics',
    icon: 'storefront',
    badge: 'Books & Apparel',
    desc: 'Order prescribed ICSE textbook bundles, house jerseys, lab coats, and official school supplies.',
    href: '/store',
    accent: 'from-teal-600 to-emerald-700',
  },
  {
    id: 'clubs',
    name: 'School Clubs & Societies',
    category: 'studentlife',
    icon: 'groups',
    badge: 'Extracurriculars',
    desc: 'Robotics, Debate, MUN, Eco-Warriors, Drama, and Chess club rosters with tournament notices.',
    href: '/clubs',
    accent: 'from-violet-600 to-purple-600',
  },
  {
    id: 'merits',
    name: 'Inter-House Merits',
    category: 'studentlife',
    icon: 'military_tech',
    badge: 'Shield Standings',
    desc: 'Phoenix, Falcon, Hercules, and Orion house points, badge accolades, and academic honor roll.',
    href: '/merits',
    accent: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'lostfound',
    name: 'Lost & Found Desk',
    category: 'studentlife',
    icon: 'search',
    badge: 'Property Recovery',
    desc: 'Image-verified repository for misplaced calculators, water bottles, identity cards, and blazer pins.',
    href: '/lostfound',
    accent: 'from-slate-600 to-zinc-700',
  },
  {
    id: 'gallery',
    name: 'Campus Event Gallery',
    category: 'studentlife',
    icon: 'photo_library',
    badge: 'Annual Day & Sports',
    desc: 'High-definition photo archives of Investiture Ceremony, Sports Meet, and Cultural Exhibitions.',
    href: '/gallery',
    accent: 'from-pink-500 to-rose-600',
  },
  {
    id: 'helpdesk',
    name: 'Parent Helpdesk & PTM',
    category: 'admin',
    icon: 'support_agent',
    badge: 'Direct Resolution',
    desc: 'Direct guardian-to-teacher communication threads, grievance tickets, and conference reservations.',
    href: '/helpdesk',
    accent: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'timetable',
    name: 'Academic Timetable',
    category: 'admin',
    icon: 'calendar_month',
    badge: 'Live Period Nodes',
    desc: 'Interactive 8-period schedule with subject teacher rooms, lab practical slots, and recess flags.',
    href: '/timetable',
    accent: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'notices',
    name: 'Notice Board & Circulars',
    category: 'admin',
    icon: 'campaign',
    badge: 'Official Bulletins',
    desc: 'Signed administrative notices, holiday schedules, fee reminders, and CISCE council directives.',
    href: '/notices',
    accent: 'from-indigo-600 to-blue-800',
  },
];

// On phones only the first 4 items of a long card list render; each tap on the
// arrow reveals 4 more. Laptop widths always render every item.
const MOBILE_REVEAL_STEP = 4;

interface BannerGlyph {
  icon: string;
  left: string;
  top: string;
  size: number;
  opacity: number;
  rotate?: number;
  wide?: boolean;
}

interface BannerSpeck {
  left: string;
  top: string;
  size: number;
  opacity: number;
  round?: boolean;
  rotate?: number;
  wide?: boolean;
}

// Decorative "code & study" texture for the nexaCampus brand banner.
// Purely presentational: hidden from assistive tech and from pointer events.
const BANNER_GLYPHS: BannerGlyph[] = [
  { icon: 'code', left: '4%', top: '8%', size: 18, opacity: 0.18 },
  { icon: 'terminal', left: '15%', top: '4%', size: 13, opacity: 0.14 },
  { icon: 'data_object', left: '26%', top: '11%', size: 16, opacity: 0.16 },
  { icon: 'calculate', left: '38%', top: '6%', size: 12, opacity: 0.12 },
  { icon: 'lightbulb', left: '58%', top: '10%', size: 13, opacity: 0.13 },
  { icon: 'school', left: '68%', top: '3%', size: 12, opacity: 0.12 },
  { icon: 'function', left: '78%', top: '7%', size: 17, opacity: 0.17 },
  { icon: 'menu_book', left: '88%', top: '13%', size: 14, opacity: 0.15 },
  { icon: 'psychology', left: '48%', top: '2%', size: 11, opacity: 0.11, wide: true },
  { icon: 'widgets', left: '93%', top: '5%', size: 11, opacity: 0.12, wide: true },
  { icon: 'developer_mode', left: '7%', top: '84%', size: 19, opacity: 0.18 },
  { icon: 'schema', left: '19%', top: '88%', size: 13, opacity: 0.14 },
  { icon: 'fact_check', left: '33%', top: '83%', size: 15, opacity: 0.15 },
  { icon: 'auto_stories', left: '62%', top: '87%', size: 13, opacity: 0.13 },
  { icon: 'key', left: '74%', top: '82%', size: 15, opacity: 0.15 },
  { icon: 'dns', left: '86%', top: '86%', size: 14, opacity: 0.14 },
  { icon: 'terminal', left: '47%', top: '90%', size: 11, opacity: 0.11, wide: true },
  { icon: 'code', left: '55%', top: '79%', size: 12, opacity: 0.12, wide: true },
];

const BANNER_DOTS: BannerSpeck[] = [
  { left: '8%', top: '4%', size: 3, opacity: 0.3, round: true },
  { left: '21%', top: '15%', size: 4, opacity: 0.26, round: true },
  { left: '34%', top: '3%', size: 3, opacity: 0.24, round: true },
  { left: '44%', top: '16%', size: 5, opacity: 0.22, round: true },
  { left: '57%', top: '5%', size: 3, opacity: 0.28, round: true },
  { left: '66%', top: '17%', size: 4, opacity: 0.24, round: true },
  { left: '72%', top: '2%', size: 3, opacity: 0.22, round: true },
  { left: '83%', top: '16%', size: 5, opacity: 0.26, round: true },
  { left: '92%', top: '6%', size: 4, opacity: 0.3, round: true },
  { left: '3%', top: '20%', size: 3, opacity: 0.18, round: true, wide: true },
  { left: '96%', top: '20%', size: 3, opacity: 0.18, round: true, wide: true },
  { left: '12%', top: '90%', size: 4, opacity: 0.28, round: true },
  { left: '27%', top: '95%', size: 3, opacity: 0.24, round: true },
  { left: '39%', top: '88%', size: 4, opacity: 0.22, round: true },
  { left: '52%', top: '94%', size: 5, opacity: 0.26, round: true },
  { left: '59%', top: '85%', size: 3, opacity: 0.2, round: true },
  { left: '70%', top: '96%', size: 4, opacity: 0.26, round: true },
  { left: '81%', top: '89%', size: 3, opacity: 0.22, round: true },
  { left: '90%', top: '94%', size: 5, opacity: 0.28, round: true },
];

const BANNER_BOXES: BannerSpeck[] = [
  { left: '11%', top: '6%', size: 14, opacity: 0.16, rotate: 12 },
  { left: '30%', top: '14%', size: 10, opacity: 0.13, rotate: -8 },
  { left: '63%', top: '3%', size: 16, opacity: 0.15, rotate: 8 },
  { left: '86%', top: '9%', size: 11, opacity: 0.14, rotate: -12 },
  { left: '16%', top: '86%', size: 12, opacity: 0.14, rotate: -10 },
  { left: '41%', top: '92%', size: 9, opacity: 0.12, rotate: 14 },
  { left: '64%', top: '84%', size: 13, opacity: 0.15, rotate: -6 },
  { left: '87%', top: '92%', size: 12, opacity: 0.14, rotate: 10 },
  { left: '1%', top: '50%', size: 22, opacity: 0.08, rotate: 12, wide: true },
  { left: '95%', top: '52%', size: 22, opacity: 0.08, rotate: -12, wide: true },
];

const SECURITY_AUDIT_CHECKS: string[] = [
  '1. SQL Injection: Parameterized pgx',
  '2. XSS: Strict CSP + React Escape',
  '3. CSRF: SameSite=Strict Cookies',
  '4. Insecure Uploads: MIME Whitelist',
  '5. IDOR: Tenant Ownership Guards',
  '6. Rate Limiting: 20 req/s IP Window',
  '7. Secure JWT: 256-Bit HS256 Secret',
  '8. Zero Secret Leakage: env-only keys',
  '9. Password Hashing: Argon2id salt',
  '10. MFA: SMS OTP & Session Tokens',
  '11. CORS: Strict Allowed Origins',
  '12. Storage: Zero localStorage JWTs',
  '13. Authorization: Backend Verified',
  '14. Row-Level Security: Active Tenants',
  '15. Webhooks: HMAC-SHA256 Signatures',
  '16. SSRF: Private IP Filtered',
  '17. Source Maps: Excluded in Prod',
  '18. Default Creds: Purged & Blocked',
  '19. Logs: PII & Auth Token Stripped',
  '20. Dependencies: Automated Snyk Pass',
];

const MODULE_FILTER_TABS: Array<{ id: 'all' | 'academics' | 'logistics' | 'studentlife' | 'admin'; label: string }> = [
  { id: 'all', label: 'All (16)' },
  { id: 'academics', label: 'Academics' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'studentlife', label: 'Student Life' },
  { id: 'admin', label: 'Admin & PTM' },
];

export default function ExecutiveHomePage() {
  const router = useRouter();
  const [activeModuleTab, setActiveModuleTab] = useState<'all' | 'academics' | 'logistics' | 'studentlife' | 'admin'>('all');
  const [mobileVisibleModules, setMobileVisibleModules] = useState<number>(MOBILE_REVEAL_STEP);
  const [mobileVisibleChecks, setMobileVisibleChecks] = useState<number>(MOBILE_REVEAL_STEP);
  const [studentFirstName, setStudentFirstName] = useState<string>('Student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hallPassSeconds, setHallPassSeconds] = useState<number>(765); // 12m 45s
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ref and scroll states for the module tabs
  const moduleTabsRef = useRef<HTMLDivElement>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'NexaCampus School | Lions Calcutta Greater Vidya Mandir';
    }
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Check scroll boundary for category tabs
  const updateTabsScrollState = () => {
    if (!moduleTabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = moduleTabsRef.current;
    setCanScrollTabsLeft(scrollLeft > 6);
    setCanScrollTabsRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    const el = moduleTabsRef.current;
    if (!el) return;
    updateTabsScrollState();
    el.addEventListener('scroll', updateTabsScrollState, { passive: true });
    window.addEventListener('resize', updateTabsScrollState, { passive: true });
    return () => {
      el.removeEventListener('scroll', updateTabsScrollState);
      window.removeEventListener('resize', updateTabsScrollState);
    };
  }, []);

  const scrollModuleTabs = (direction: 'left' | 'right') => {
    if (!moduleTabsRef.current) return;
    const container = moduleTabsRef.current;
    const scrollStep = container.clientWidth * 0.67;
    container.scrollBy({
      left: direction === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth',
    });
  };

  // Drag-to-scroll for mouse / desktop responsiveness
  const isDraggingTabsRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!moduleTabsRef.current) return;
    isDraggingTabsRef.current = true;
    dragStartXRef.current = e.pageX - moduleTabsRef.current.offsetLeft;
    dragScrollLeftRef.current = moduleTabsRef.current.scrollLeft;
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabsRef.current || !moduleTabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - moduleTabsRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5;
    moduleTabsRef.current.scrollLeft = dragScrollLeftRef.current - walk;
  };

  const handleTabsMouseUp = () => {
    isDraggingTabsRef.current = false;
  };

  useEffect(() => {
    // Check if session exists and extract ONLY the first name
    const session = getSession();
    if (session) {
      setIsAuthenticated(true);
      const rawName = session.student?.name || session.name || '';
      if (rawName.trim()) {
        const first = rawName.trim().split(/\s+/)[0];
        setStudentFirstName(first);
      }
    }
  }, []);

  // Countdown timer for Hall Pass simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setHallPassSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filtered modules
  const filteredModules = useMemo(() => {
    if (activeModuleTab === 'all') return MODULES_DATA;
    return MODULES_DATA.filter((m) => m.category === activeModuleTab);
  }, [activeModuleTab]);

  // Phones progressively reveal the directory; laptops always render every card.
  const visibleModuleCount = Math.min(mobileVisibleModules, filteredModules.length);
  const hasHiddenModules = visibleModuleCount < filteredModules.length;

  const revealMoreModules = () => {
    if (hasHiddenModules) {
      setMobileVisibleModules((prev) => Math.min(prev + MOBILE_REVEAL_STEP, filteredModules.length));
      return;
    }
    setMobileVisibleModules(MOBILE_REVEAL_STEP);
  };

  useEffect(() => {
    setMobileVisibleModules(MOBILE_REVEAL_STEP);
  }, [activeModuleTab]);

  const visibleSecurityChecks = Math.min(mobileVisibleChecks, SECURITY_AUDIT_CHECKS.length);

  const toggleSecurityChecks = () => {
    setMobileVisibleChecks((prev) =>
      prev >= SECURITY_AUDIT_CHECKS.length
        ? MOBILE_REVEAL_STEP
        : Math.min(prev + MOBILE_REVEAL_STEP, SECURITY_AUDIT_CHECKS.length)
    );
  };

  // Subtle 3D tilt tracking for hero card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#12131a] text-[#131b2e] dark:text-[#eaedff] selection:bg-[#3b49df] selection:text-white transition-colors duration-200">
      
      {/* =========================================================================
          DIV 1: EXECUTIVE 3D INTERACTIVE HERO SECTION
          ========================================================================= */}
      <div id="hero" className="relative overflow-hidden border-b border-[#e2e7ff] dark:border-[#222538] bg-gradient-to-b from-white via-[#faf8ff] to-[#f2f3ff] dark:from-[#151622] dark:via-[#13141f] dark:to-[#0e0f17]">
        {/* Ambient colored lighting glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#3b49df]/10 dark:bg-[#3b49df]/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#fea619]/10 dark:bg-[#fea619]/10 blur-[140px] pointer-events-none" />

        {/* Global Executive Top Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#151622]/85 border-b border-[#e2e7ff]/70 dark:border-[#222538]/70 px-4 sm:px-6 lg:px-12 py-3 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo Emblem & School Identity */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <LogoEmblem className="h-10 w-10 drop-shadow-sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[17px] tracking-tight text-[#1c2ac8] dark:text-[#bdc2ff] group-hover:text-[#3b49df] transition-colors">
                    NexaCampus
                  </span>
                </div>
                <span className="text-[11px] text-[#454655] dark:text-[#a0a4c0] font-medium hidden sm:inline-block">
                  Lions Calcutta Greater Vidya Mandir • CISCE
                </span>
              </div>
            </Link>

            {/* Quick Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#454655] dark:text-[#c4c7e0]">
              <a href="#modules" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors">16 Modules</a>
              <a href="#backend-architecture" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors">Architecture</a>
              <a href="#timetable-stream" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors">Timetable</a>
              <a href="#canteen-wallet" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors">Canteen</a>
              <a href="#bus-radar" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors">Bus Radar</a>
              <a href="#exam-radar" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors">Examinations</a>
            </nav>

            {/* Actions: Theme Toggle + Role Entry + Mobile Hamburger Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <DarkModeToggle />
              {isAuthenticated ? (
                <Link
                  href="/home"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white text-[12px] sm:text-[13px] font-bold shadow-sm shadow-[#1c2ac8]/25 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span className="hidden sm:inline">{studentFirstName}&apos;s Portal</span>
                  <span className="sm:hidden">Portal</span>
                </Link>
              ) : (
                <Link
                  href="/chooser"
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white text-[12px] sm:text-[13px] font-bold shadow-sm shadow-[#1c2ac8]/25 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Enter Portal</span>
                </Link>
              )}
              {/* Mobile Navigation Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#131b2e] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-transform flex-shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
            </div>
          </div>
        </header>

        {/* Accessible Slide-Out Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Main Navigation Menu"
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-[#161824] shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e7ff] dark:border-[#262a40]">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                    <LogoEmblem className="h-8 w-8" />
                    <div>
                      <span className="font-extrabold text-sm text-[#1c2ac8] dark:text-[#bdc2ff] block leading-tight">
                        NexaCampus
                      </span>
                      <span className="text-[10px] text-[#454655] dark:text-[#a0a4c0] block">
                        LCGVM • CISCE WB-243
                      </span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#454655] dark:text-[#a0a4c0] hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Section Navigation Links */}
                <div className="py-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0] mb-2 px-1">
                    On-Page Sections
                  </p>
                  <nav className="flex flex-col gap-1 text-sm font-semibold">
                    {[
                      { label: '16 Integrated Modules', href: '#modules', icon: 'apps' },
                      { label: 'Backend Architecture', href: '#backend-architecture', icon: 'dns' },
                      { label: 'Live Timetable Stream', href: '#timetable-stream', icon: 'calendar_month' },
                      { label: 'Smart Canteen RFID', href: '#canteen-wallet', icon: 'restaurant' },
                      { label: 'School Bus GPS Radar', href: '#bus-radar', icon: 'directions_bus' },
                      { label: 'Examinations & Marks', href: '#exam-radar', icon: 'workspace_premium' },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface hover:bg-[#eaedff] dark:hover:bg-[#202334] hover:text-[#1c2ac8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[19px] text-[#1c2ac8] dark:text-[#bdc2ff]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Quick Student Portal Shortcuts */}
                <div className="py-3 border-t border-[#e2e7ff] dark:border-[#262a40]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0] mb-2 px-1">
                    Student Portals
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <Link
                      href="/home"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-surface-container dark:bg-[#202334] text-on-surface hover:text-[#1c2ac8] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">dashboard</span>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/timetable"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-surface-container dark:bg-[#202334] text-on-surface hover:text-[#1c2ac8] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                      <span>Timetable</span>
                    </Link>
                    <Link
                      href="/notices"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-surface-container dark:bg-[#202334] text-on-surface hover:text-[#1c2ac8] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">campaign</span>
                      <span>Notices</span>
                    </Link>
                    <Link
                      href="/helpdesk"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-surface-container dark:bg-[#202334] text-on-surface hover:text-[#1c2ac8] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">support_agent</span>
                      <span>Parent Desk</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom CTA */}
              <div className="pt-4 border-t border-[#e2e7ff] dark:border-[#262a40] flex flex-col gap-2">
                <Link
                  href="/chooser"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full bg-[#1c2ac8] text-white text-center font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Enter Student Portal</span>
                </Link>
                <div className="flex items-center justify-between text-[11px] text-outline px-1">
                  <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">
                    Privacy Policy
                  </Link>
                  <a href="tel:+913324371234" className="hover:text-primary">
                    +91 33 2437 1234
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner Grid with 3D Perspective Model */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-16 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & High-Impact Copy */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              
              {/* Institutional Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b49df]/10 dark:bg-[#3b49df]/20 border border-[#3b49df]/20 text-[#1c2ac8] dark:text-[#bdc2ff] text-[12px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Go Engine v1.23 Online • CISCE Affiliation WB243</span>
              </div>

              {/* Primary Poppins Headline with Excalidraw Virgil Stylish Annotation & Dynamic Typewriter */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#131b2e] dark:text-white">
                <HeroTypewriter /> <br />
                <span className="bg-gradient-to-r from-[#1c2ac8] via-[#3b49df] to-[#6366f1] dark:from-[#bdc2ff] dark:via-[#9398ff] dark:to-[#6ffbbe] bg-clip-text text-transparent">
                  Connected Intelligence
                </span>
              </h1>

              {/* Hand-drawn Virgil stylish text accent */}
              <div className="font-virgil text-lg sm:text-xl text-[#fea619] dark:text-[#ffb95f] rotate-[-1.5deg] font-bold select-none">
                ✦ Handcrafted for LCGVM Students, Teachers & Parents with &lt;1ms response!
              </div>

              {/* Subtitle Description */}
              <p className="text-base sm:text-lg text-[#454655] dark:text-[#c4c7e0] leading-relaxed max-w-2xl font-normal">
                Welcome to the official digital twin of Lions Calcutta Greater Vidya Mandir.
                Access 16 integrated modules, live transit telemetry, RFID smart dining, and
                encrypted academic performance trackers within a lightweight 3MB progressive web app.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
                <Link
                  href="/chooser"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white font-bold text-[14px] shadow-lg shadow-[#1c2ac8]/30 hover:shadow-xl hover:shadow-[#1c2ac8]/40 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span>Student & Parent Chooser</span>
                </Link>
                <a
                  href="#modules"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full bg-white dark:bg-[#1e202f] hover:bg-[#eaedff] dark:hover:bg-[#25283d] text-[#1c2ac8] dark:text-[#bdc2ff] font-bold text-[14px] border border-[#c6c5d8]/40 dark:border-[#343852] shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                  <span>Explore 16 Services</span>
                </a>
                <a
                  href="#backend-architecture"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full text-[#454655] dark:text-[#a0a4c0] hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] font-semibold text-[13px] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  <span>Security Blueprint</span>
                </a>
              </div>

              {/* Fast Features Ticker Row */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#454655] dark:text-[#a0a4c0]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  <span>100% Mobile Responsive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">bolt</span>
                  <span>TinyLFU In-Memory Caching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">lock</span>
                  <span>HttpOnly OWASP-20 Shield</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Perspective Visual Model */}
            <div
              className="lg:col-span-5 relative flex items-center justify-center"
              style={{ perspective: 1200 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="relative w-full max-w-[390px] transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateX(${-mousePosition.y * 14}deg) rotateY(${mousePosition.x * 18}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Primary Card: Holographic Student Smart Credential */}
                <div className="relative rounded-[2rem] p-6 bg-gradient-to-br from-[#1c2ac8] via-[#2a38db] to-[#121c87] text-white shadow-2xl shadow-[#1c2ac8]/35 border border-white/20 overflow-hidden">
                  
                  {/* Hologram metallic reflection gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />

                  {/* Top Row: School Crest & RFID Wave */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center font-black text-amber-300 text-xs">
                        LC
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                          Lions Calcutta Greater Vidya Mandir
                        </div>
                        <div className="text-[9px] text-white/70 font-mono">
                          CISCE AFFILIATED WB-243 • SENIOR WING
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[22px] text-white/80">contactless</span>
                  </div>

                  {/* Student Persona Showcase */}
                  <div className="mt-5 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-white/20 p-1 border border-white/30 flex-shrink-0 overflow-hidden shadow-inner">
                      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-300 to-amber-200 flex items-center justify-center text-indigo-900 font-extrabold text-xl">
                        {studentFirstName[0] || 'A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
                        Verified Student
                      </div>
                      <div className="text-xl font-bold tracking-tight">
                        {studentFirstName}
                      </div>
                      <div className="text-[12px] text-white/80">
                        Class XI-A • Science Stream
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Chips */}
                  <div className="mt-5 grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-center">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">Roll No</div>
                      <div className="text-[14px] font-extrabold text-white">24</div>
                    </div>
                    <div className="border-x border-white/10">
                      <div className="text-[9px] uppercase tracking-wider text-white/60">House</div>
                      <div className="text-[14px] font-extrabold text-amber-300">Phoenix</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">Attendance</div>
                      <div className="text-[14px] font-extrabold text-emerald-400">98.4%</div>
                    </div>
                  </div>

                  {/* Bottom Strip: Barcode & Digital Security Chip */}
                  <div className="mt-5 flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-wider text-white/60 font-mono">RFID ENCRYPTED ID</span>
                      <span className="text-[11px] font-mono tracking-widest text-white/90">LCGVM-2026-XI-0492</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE GATE PASS
                    </div>
                  </div>
                </div>

                {/* Floating 3D Layer 2: Live Period Micro-Card */}
                <div
                  className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/90 dark:bg-[#1a1b28]/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#e2e7ff] dark:border-[#2a2e45] text-[#131b2e] dark:text-white max-w-[210px] hidden sm:block"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live Period
                    </span>
                  </div>
                  <div className="font-bold text-[13px] mt-1">Computer Science</div>
                  <div className="text-[11px] text-[#454655] dark:text-[#a0a4c0]">Lab B-204 • Mrs. Sen</div>
                </div>

                {/* Floating 3D Layer 3: Canteen RFID Balance Orb */}
                <div
                  className="absolute -top-5 -right-5 bg-gradient-to-tr from-[#fea619] to-amber-300 text-stone-900 p-3.5 rounded-2xl shadow-xl border border-amber-200/50 max-w-[170px] hidden sm:block"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-800">
                    RFID Wallet
                  </div>
                  <div className="font-black text-[17px] tracking-tight">₹850.00</div>
                  <div className="text-[10px] text-stone-800/80 font-medium">Daily Limit: ₹250</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          DIV 2: LIVE ACADEMIC TELEMETRY & PERFORMANCE METRICS TICKER
          ========================================================================= */}
      <div id="telemetry-ticker" className="py-10 bg-white dark:bg-[#151622] border-b border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            
            <div className="levitate-card group p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] flex flex-col justify-between hover:border-[#1c2ac8]/50 dark:hover:border-[#3b49df]/60 hover:shadow-xl hover:shadow-[#1c2ac8]/15 dark:hover:shadow-[#3b49df]/20 cursor-pointer">
              <div className="flex items-center justify-between text-[#1c2ac8] dark:text-[#bdc2ff]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Rate</span>
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">event_available</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] dark:text-white">99.2%</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Above CISCE 75% Rule
                </div>
              </div>
            </div>

            <div className="levitate-card group p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] flex flex-col justify-between hover:border-indigo-500/50 dark:hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/20 cursor-pointer">
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Digital Modules</span>
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">widgets</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] dark:text-white">16 Active</div>
                <div className="text-[11px] text-[#454655] dark:text-[#a0a4c0] font-semibold mt-0.5">
                  Zero Redirection Lag
                </div>
              </div>
            </div>

            <div className="levitate-card group p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] flex flex-col justify-between hover:border-amber-500/50 dark:hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/20 cursor-pointer">
              <div className="flex items-center justify-between text-amber-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">L1 Cache Latency</span>
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">speed</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] dark:text-white">&lt;0.8ms</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                  TinyLFU SingleFlight
                </div>
              </div>
            </div>

            <div className="levitate-card group p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] flex flex-col justify-between hover:border-rose-500/50 dark:hover:border-rose-400/60 hover:shadow-xl hover:shadow-rose-500/15 dark:hover:shadow-rose-500/20 cursor-pointer">
              <div className="flex items-center justify-between text-rose-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">House Shield</span>
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">military_tech</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] dark:text-white">1,240 pts</div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                  Phoenix House Leads
                </div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 levitate-card group p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] flex flex-col justify-between hover:border-teal-500/50 dark:hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/15 dark:hover:shadow-teal-500/20 cursor-pointer">
              <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">OWASP Shield</span>
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">shield</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] dark:text-white">20-Point</div>
                <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                  HttpOnly Strictly Bound
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          DIV 3: INTERACTIVE 16-MODULE CAMPUS ECOSYSTEM DIRECTORY
          ========================================================================= */}
      <div id="modules" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c2ac8]/10 text-[#1c2ac8] dark:text-[#bdc2ff] text-[11px] font-bold uppercase tracking-wider mb-2">
              Integrated Campus Services
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              16 Institutional Micro-Modules
            </h2>
            <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 max-w-2xl font-normal">
              Click any module to jump directly into the live feature screen. Fully unified across mobile and desktop.
            </p>
          </div>

          {/* Module Filter Chips - Responsive: Exactly 3 visible on small screens with horizontal scroll */}
          <div className="w-full sm:w-auto">
            <div
              ref={moduleTabsRef}
              onScroll={updateTabsScrollState}
              onMouseDown={handleTabsMouseDown}
              onMouseMove={handleTabsMouseMove}
              onMouseUp={handleTabsMouseUp}
              onMouseLeave={handleTabsMouseUp}
              className="w-full sm:w-auto flex flex-nowrap items-center gap-1.5 p-1 rounded-full bg-[#eaedff] dark:bg-[#1a1c2b] border border-[#c6c5d8]/40 dark:border-[#2c3048] overflow-x-auto scroll-smooth snap-x snap-mandatory select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {MODULE_FILTER_TABS.map((tab) => {
                const isActive = activeModuleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={(e) => {
                      setActiveModuleTab(tab.id);
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center',
                      });
                    }}
                    className={`shrink-0 snap-start w-[calc((100%-12px)/3)] sm:w-auto px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1c2ac8] text-white shadow-sm'
                        : 'text-[#454655] dark:text-[#a0a4c0] hover:text-[#1c2ac8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Horizontal Scroll Controls & Helper Indicator */}
            <div className="flex sm:hidden items-center justify-between px-2 pt-2 text-xs text-[#454655] dark:text-[#a0a4c0]">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="material-symbols-outlined text-sm text-[#1c2ac8] dark:text-[#bdc2ff]">swap_horiz</span>
                <span className="font-medium text-[#454655] dark:text-[#a0a4c0]">Swipe to explore (3 of 5 visible)</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollModuleTabs('left')}
                  disabled={!canScrollTabsLeft}
                  aria-label="Scroll categories left"
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-[#eaedff] dark:bg-[#1a1c2b] text-[#1c2ac8] dark:text-[#bdc2ff] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1c2ac8] hover:text-white transition-all shadow-xs border border-[#c6c5d8]/40 dark:border-[#2c3048]"
                >
                  <span className="material-symbols-outlined text-xs">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollModuleTabs('right')}
                  disabled={!canScrollTabsRight}
                  aria-label="Scroll categories right"
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-[#eaedff] dark:bg-[#1a1c2b] text-[#1c2ac8] dark:text-[#bdc2ff] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1c2ac8] hover:text-white transition-all shadow-xs border border-[#c6c5d8]/40 dark:border-[#2c3048]"
                >
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 16-Module Responsive Cards Grid - phones reveal 4 at a time, laptops show all */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredModules.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={`levitate-card group p-5 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#3b49df]/60 hover:shadow-2xl hover:shadow-[#1c2ac8]/18 dark:hover:shadow-[#3b49df]/25 flex flex-col justify-between cursor-pointer ${
                index >= visibleModuleCount ? 'hidden lg:flex' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${item.accent} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f2f3ff] dark:bg-[#23263b] text-[#1c2ac8] dark:text-[#bdc2ff] border border-[#e2e7ff] dark:border-[#333752] group-hover:border-[#3b49df]/40 transition-colors">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#131b2e] dark:text-white group-hover:text-[#1c2ac8] dark:group-hover:text-[#bdc2ff] transition-colors">
                  {item.name}
                </h3>
                <p className="text-[12px] text-[#454655] dark:text-[#a0a4c0] mt-1.5 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f2f3ff] dark:border-[#24283d] flex items-center justify-between text-[12px] font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">
                <span>Launch Screen</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform duration-300">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Phone-only progressive reveal control for the micro-module directory */}
        <RevealMore
          visible={visibleModuleCount}
          total={filteredModules.length}
          onToggle={revealMoreModules}
          step={MOBILE_REVEAL_STEP}
          noun="micro modules"
        />
      </div>

      {/* =========================================================================
          DIV 4: GO MICROSERVICES & 20-POINT SECURITY HARDENING BLUEPRINT
          ========================================================================= */}
      <div id="backend-architecture" className="py-16 sm:py-24 bg-[#f2f3ff] dark:bg-[#151622] border-y border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c2ac8]/10 text-[#1c2ac8] dark:text-[#bdc2ff] text-[11px] font-bold uppercase tracking-wider mb-2">
              High-Concurreny Infrastructure
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Go Engine Architecture & Security Fortress
            </h2>
            <div className="font-virgil text-base sm:text-lg text-[#fea619] dark:text-[#ffb95f] mt-1 font-bold">
              *Zero localStorage secrets + TinyLFU In-Memory Cache = Unbreakable Speed
            </div>
            <p className="text-sm sm:text-base text-[#454655] dark:text-[#c4c7e0] mt-2 font-normal">
              Designed to handle 1,000+ simultaneous requests on a lean 1 vCPU VPS with zero database saturation.
            </p>
          </div>

          {/* Visual Architecture Flow Diagram */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#2a2e45] shadow-lg mb-12">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0] mb-6 text-center">
              End-to-End Pipeline: Client to Database
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center font-mono text-xs">
              
              <div className="levitate-card-sm p-3.5 rounded-xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42] hover:border-[#1c2ac8]/60 dark:hover:border-[#3b49df]/70 hover:shadow-xl hover:shadow-[#1c2ac8]/15 dark:hover:shadow-[#3b49df]/20 cursor-pointer">
                <div className="font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">Next.js Client</div>
                <div className="text-[10px] text-[#454655] dark:text-[#a0a4c0] mt-1">3MB Chrome PWA</div>
              </div>

              <div className="hidden md:flex justify-center text-[#1c2ac8]">
                <span className="material-symbols-outlined">trending_flat</span>
              </div>

              <div className="levitate-card-sm p-3.5 rounded-xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42] hover:border-amber-500/60 dark:hover:border-amber-400/70 hover:shadow-xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/20 cursor-pointer">
                <div className="font-bold text-amber-600 dark:text-amber-400">HttpOnly Cookie</div>
                <div className="text-[10px] text-[#454655] dark:text-[#a0a4c0] mt-1">school_auth_token</div>
              </div>

              <div className="hidden md:flex justify-center text-[#1c2ac8]">
                <span className="material-symbols-outlined">trending_flat</span>
              </div>

              <div className="levitate-card-sm p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:border-blue-500/70 dark:hover:border-blue-400/80 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/25 cursor-pointer">
                <div className="font-bold text-blue-700 dark:text-blue-300">Go v1.23 Engine</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">TinyLFU &lt;0.8ms</div>
              </div>

              <div className="hidden md:flex justify-center text-[#1c2ac8]">
                <span className="material-symbols-outlined">trending_flat</span>
              </div>

              <div className="levitate-card-sm p-3.5 rounded-xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42] hover:border-emerald-500/60 dark:hover:border-emerald-400/70 hover:shadow-xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/20 cursor-pointer">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">Postgres / SQLite</div>
                <div className="text-[10px] text-[#454655] dark:text-[#a0a4c0] mt-1">SingleFlight Coalesced</div>
              </div>

            </div>
          </div>

          {/* 20-Point Security Compliance Matrix */}
          <div className="bg-white dark:bg-[#1a1c2b] rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] dark:border-[#2a2e45]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e2e7ff] dark:border-[#24283d]">
              <div>
                <h3 className="text-lg font-extrabold text-[#131b2e] dark:text-white">
                  20-Point Security Audit Alignment
                </h3>
                <p className="text-xs text-[#454655] dark:text-[#a0a4c0]">
                  Full compliance across OWASP Top 10, cryptographic HMAC webhooks, and session isolation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 whitespace-nowrap shrink-0">
                20 / 20 PASS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {SECURITY_AUDIT_CHECKS.map((item, idx) => (
                <div
                  key={idx}
                  className={`levitate-card-sm group/sec flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] hover:border-emerald-500/50 dark:hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/15 cursor-pointer ${
                    idx >= visibleSecurityChecks ? 'hidden lg:flex' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-emerald-500 group-hover/sec:scale-115 group-hover/sec:text-emerald-400 text-[16px] flex-shrink-0 transition-transform duration-300">
                    check_circle
                  </span>
                  <span className="font-medium text-[#131b2e] dark:text-[#eaedff] group-hover/sec:text-emerald-600 dark:group-hover/sec:text-emerald-300 transition-colors">{item}</span>
                </div>
              ))}
            </div>

            {/* Phone-only progressive reveal control for the security matrix */}
            <RevealMore
              visible={visibleSecurityChecks}
              total={SECURITY_AUDIT_CHECKS.length}
              onToggle={toggleSecurityChecks}
              step={MOBILE_REVEAL_STEP}
              tone="success"
              noun="security checks"
            />
          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 5: LIVE ACADEMIC TIMETABLE & CONNECTED PERIOD NODE STREAM
          ========================================================================= */}
      <div id="timetable-stream" className="py-16 sm:py-24 bg-[#faf8ff] dark:bg-[#12131d] border-b border-[#e2e7ff] dark:border-[#222538] relative overflow-hidden">
        
        {/* Subtle decorative grid boxes (box-box) pattern in the background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e7ff_1px,transparent_1px),linear-gradient(to_bottom,#e2e7ff_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262a40_1px,transparent_1px),linear-gradient(to_bottom,#262a40_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c2ac8]/10 text-[#1c2ac8] dark:text-[#bdc2ff] text-[11px] font-bold uppercase tracking-wider mb-2">
              Dynamic Schedule
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Live Period Timetable Stream
            </h2>
            <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 font-normal">
              Real-time status of today&apos;s academic schedule with connected room locations and teacher assignments.
            </p>
          </div>

          {/* White Box Container Card in Background */}
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#2a2e45] shadow-xl shadow-[#1c2ac8]/5 relative overflow-hidden">
            
            {/* Ambient subtle decorative glow */}
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#1c2ac8]/5 dark:bg-[#3b49df]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#fea619]/5 dark:bg-[#fea619]/10 blur-3xl pointer-events-none" />

            {/* Connected Vertical Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#1c2ac8]/30 dark:border-[#3b49df]/40 space-y-8">
              
              {/* Period 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#12131a]" />
                <div className="levitate-card-sm p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#1c2ac8]/50 hover:shadow-xl hover:shadow-[#1c2ac8]/10 cursor-pointer shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">Period 1 • 08:30 AM – 09:15 AM</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-[10px]">COMPLETED</span>
                  </div>
                  <div className="text-base font-extrabold text-[#131b2e] dark:text-white mt-1">
                    Mathematics: Differential Calculus
                  </div>
                  <div className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-0.5">
                    Room 402 • Dr. Mukherjee • Senior Wing
                  </div>
                </div>
              </div>

              {/* Period 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#12131a]" />
                <div className="levitate-card-sm p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] hover:border-[#1c2ac8]/50 hover:shadow-xl hover:shadow-[#1c2ac8]/10 cursor-pointer shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">Period 2 • 09:15 AM – 10:00 AM</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-[10px]">COMPLETED</span>
                  </div>
                  <div className="text-base font-extrabold text-[#131b2e] dark:text-white mt-1">
                    English Literature: Shakespeare&apos;s The Tempest
                  </div>
                  <div className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-0.5">
                    Room 402 • Mrs. Roy • Act III Scene II Analysis
                  </div>
                </div>
              </div>

              {/* Period 3 (LIVE PRACTICAL NOW) */}
              <div className="relative">
                <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-300/40 dark:ring-emerald-900/60 animate-bounce">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                </div>
                <div className="levitate-card-sm p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1b213b] dark:to-[#171d33] border-2 border-[#1c2ac8] dark:border-[#3b49df] hover:border-[#3b49df] hover:shadow-2xl hover:shadow-[#1c2ac8]/20 cursor-pointer shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-extrabold text-[#1c2ac8] dark:text-[#bdc2ff]">Period 4 • 11:15 AM – 12:15 PM</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] animate-pulse">
                      ⚡ LIVE PRACTICAL NOW
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-[#131b2e] dark:text-white mt-1">
                    Computer Science: Java Object-Oriented Frameworks
                  </div>
                  <div className="text-xs text-[#454655] dark:text-[#c4c7e0] mt-0.5">
                    CS Lab B-204 • Mrs. Sen • Polymorphism & Data Structures
                  </div>
                  <div className="font-virgil text-sm text-[#fea619] dark:text-[#ffb95f] mt-2 font-bold">
                    *Practical file submission due by 12:10 PM!
                  </div>
                </div>
              </div>

              {/* Period 4 (Recess) */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-white dark:ring-[#12131a]" />
                <div className="levitate-card-sm p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400">Recess • 12:15 PM – 12:55 PM</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold text-[10px]">UPCOMING</span>
                  </div>
                  <div className="text-base font-extrabold text-[#131b2e] dark:text-white mt-1">
                    Campus Dining & Social Recess
                  </div>
                  <div className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-0.5">
                    Main Cafeteria • RFID Fast-Checkout Active
                  </div>
                </div>
              </div>

              {/* Period 5 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-400 ring-4 ring-white dark:ring-[#12131a]" />
                <div className="levitate-card-sm p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#454655] dark:text-[#a0a4c0]">Period 5 • 12:55 PM – 01:40 PM</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-[10px]">UPCOMING</span>
                  </div>
                  <div className="text-base font-extrabold text-[#131b2e] dark:text-white mt-1">
                    Chemistry: Organic Reaction Mechanisms
                  </div>
                  <div className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-0.5">
                    Chemistry Lab 2 • Dr. S. Ghosh
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 6: SMART CANTEEN RFID WALLET & DIGITAL CARD SIMULATION
          ========================================================================= */}
      <div id="canteen-wallet" className="py-16 sm:py-24 bg-[#faf8ff] dark:bg-[#151622] border-t border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: 3D Smart Card Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-tr from-[#131b2e] via-[#1a233d] to-[#252847] text-white shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-2xl">lunch_dining</span>
                    <span className="font-black text-sm tracking-wide">NexaPay RFID DINING</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    CONTACTLESS ACTIVE
                  </span>
                </div>

                <div className="my-6">
                  <div className="text-xs text-white/60 uppercase font-mono">Available Balance</div>
                  <div className="text-4xl font-black text-amber-300 tracking-tight mt-1">₹850.00</div>
                  <div className="text-xs text-white/70 mt-1">Daily Cap: ₹250.00 / ₹250.00 remaining</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-white/50 text-[10px]">CARD HOLDER</div>
                    <div className="font-bold text-white tracking-wide">{studentFirstName}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-[10px]">CAMPUS UID</div>
                    <div className="font-mono text-white/80">WB243-7721</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <Link
                  href="/canteen"
                  className="flex-1 py-3 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white font-bold text-xs text-center shadow-md transition-all"
                >
                  View Today&apos;s Menu & Order
                </Link>
              </div>
            </div>

            {/* Right: Live Cafeteria Specials Table */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-[#131b2e] dark:text-white">
                  Today&apos;s Fresh Cafeteria Menu
                </h3>
                <span className="text-xs text-[#454655] dark:text-[#a0a4c0] font-semibold">
                  Live Stock • Kitchen Counter 1 & 2
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#e2e7ff] dark:border-[#262a40] bg-white dark:bg-[#1a1c2b]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f2f3ff] dark:bg-[#202337] text-[#454655] dark:text-[#a0a4c0] font-bold uppercase border-b border-[#e2e7ff] dark:border-[#262a40]">
                    <tr>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Nutrition</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e7ff] dark:divide-[#262a40] font-medium">
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#131b2e] dark:text-white">Steamed Paneer Roll</td>
                      <td className="py-3 px-4 text-emerald-600 font-semibold">Veg</td>
                      <td className="py-3 px-4 text-[#454655] dark:text-[#a0a4c0]">14g Protein • 320 Cal</td>
                      <td className="py-3 px-4 font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">₹65.00</td>
                      <td className="py-3 px-4"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#131b2e] dark:text-white">Fresh Fruit Bowl & Sprouts</td>
                      <td className="py-3 px-4 text-emerald-600 font-semibold">Veg Healthy</td>
                      <td className="py-3 px-4 text-[#454655] dark:text-[#a0a4c0]">Vitamin Rich • 180 Cal</td>
                      <td className="py-3 px-4 font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">₹45.00</td>
                      <td className="py-3 px-4"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#131b2e] dark:text-white">Grilled Chicken Club Sandwich</td>
                      <td className="py-3 px-4 text-rose-600 font-semibold">Non-Veg</td>
                      <td className="py-3 px-4 text-[#454655] dark:text-[#a0a4c0]">22g Protein • 380 Cal</td>
                      <td className="py-3 px-4 font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">₹85.00</td>
                      <td className="py-3 px-4"><span className="text-amber-500 font-bold">Few Left</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#131b2e] dark:text-white">Fresh Tender Coconut Shake</td>
                      <td className="py-3 px-4 text-cyan-600 font-semibold">Beverage</td>
                      <td className="py-3 px-4 text-[#454655] dark:text-[#a0a4c0]">Natural Electrolytes</td>
                      <td className="py-3 px-4 font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">₹35.00</td>
                      <td className="py-3 px-4"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 7: LIVE GPS BUS TELEMETRY & FLEET ROUTE RADAR
          ========================================================================= */}
      <div id="bus-radar" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              Fleet Radar & Safety
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Live Transit Telemetry: Bus 14-A
            </h2>
            <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 font-normal">
              Active GPS radar pinging vehicle speed, driver contact, and arrival estimates along EM Bypass.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Telemetry Ping: 2s ago</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Telemetry Stats Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#454655] dark:text-[#a0a4c0] font-bold uppercase">Bus Registration</span>
                <span className="font-mono font-extrabold text-sm text-[#1c2ac8] dark:text-[#bdc2ff]">WB-02-AK-9042</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#454655] dark:text-[#a0a4c0] font-bold uppercase">Current Speed</span>
                <span className="font-bold text-sm text-emerald-600">28.4 km/h (Safe Zone)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#454655] dark:text-[#a0a4c0] font-bold uppercase">Assigned Driver</span>
                <span className="font-bold text-sm text-[#131b2e] dark:text-white">Rajesh Sharma (Verified)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#454655] dark:text-[#a0a4c0] font-bold uppercase">Next Scheduled Stop</span>
                <span className="font-bold text-sm text-amber-500">Ruby Crossing (ETA 6m)</span>
              </div>
            </div>

            <Link
              href="/bus"
              className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
              <span>Open Full Fleet Map</span>
            </Link>
          </div>

          {/* Route Radar Visual SVG Graphic */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0] mb-4">
              EM Bypass Corridors (Route 14-A Active Tracking)
            </h4>

            {/* SVG Visual Track */}
            <div className="relative py-4">
              <div className="h-2 w-full bg-[#e2e7ff] dark:bg-[#2c3048] rounded-full relative">
                {/* Active progress */}
                <div className="h-full bg-blue-600 rounded-full w-[65%]" />
                {/* Bus marker */}
                <div className="absolute top-1/2 left-[65%] -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-300 dark:ring-blue-900 animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                </div>
              </div>

              {/* 5 Stops Along the Line */}
              <div className="grid grid-cols-5 gap-1 mt-6 text-center text-[10px] font-semibold">
                <div>
                  <div className="text-emerald-600 dark:text-emerald-400">Gariahat</div>
                  <div className="text-[#454655] dark:text-[#a0a4c0] text-[9px]">07:15 AM (Passed)</div>
                </div>
                <div>
                  <div className="text-emerald-600 dark:text-emerald-400">Ballygunge</div>
                  <div className="text-[#454655] dark:text-[#a0a4c0] text-[9px]">07:30 AM (Passed)</div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-extrabold">Ruby Crossing</div>
                  <div className="text-blue-600 dark:text-blue-400 text-[9px]">ETA 6 mins</div>
                </div>
                <div>
                  <div className="text-[#454655] dark:text-[#a0a4c0]">Chingrighata</div>
                  <div className="text-[#454655] dark:text-[#a0a4c0] text-[9px]">08:05 AM</div>
                </div>
                <div>
                  <div className="text-[#454655] dark:text-[#a0a4c0]">School Gate</div>
                  <div className="text-[#454655] dark:text-[#a0a4c0] text-[9px]">08:20 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          DIV 8: EXAMINATION, ADMIT CARD & GRADE ANALYTICS RADAR
          ========================================================================= */}
      <div id="exam-radar" className="py-16 sm:py-24 bg-[#faf8ff] dark:bg-[#151622] border-t border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              Performance & Certification
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Terminal Examination & Grade Analytics
            </h2>
            <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 font-normal">
              Official CISCE board preparation assessments, admit card digital verifications, and percentile breakdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Admit Card Preview */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e7ff] dark:border-[#262a40]">
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-600">Official Admit Card</div>
                  <div className="text-base font-extrabold text-[#131b2e] dark:text-white">ICSE Mid-Term Assessment</div>
                </div>
                <span className="material-symbols-outlined text-2xl text-amber-500">verified</span>
              </div>

              <div className="my-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#454655] dark:text-[#a0a4c0]">Candidate Name:</span>
                  <span className="font-bold text-[#131b2e] dark:text-white">{studentFirstName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#454655] dark:text-[#a0a4c0]">Roll Number:</span>
                  <span className="font-mono font-bold text-[#1c2ac8] dark:text-[#bdc2ff]">24-SCI-019</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#454655] dark:text-[#a0a4c0]">Exam Centre:</span>
                  <span className="font-bold text-[#131b2e] dark:text-white">LCGVM Senior Hall A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#454655] dark:text-[#a0a4c0]">Reporting Time:</span>
                  <span className="font-bold text-emerald-600">08:15 AM Sharp</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#24283d] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#1c2ac8]">qr_code_2</span>
                  <span className="text-[10px] text-[#454655] dark:text-[#a0a4c0]">HMAC Digital Seal Attached</span>
                </div>
                <Link
                  href="/exams"
                  className="px-3 py-1 rounded-full bg-[#1c2ac8] text-white text-[11px] font-bold hover:bg-[#3b49df] transition-colors"
                >
                  Download PDF
                </Link>
              </div>
            </div>

            {/* Subject Performance Graph */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-[#131b2e] dark:text-white">
                    Subject Performance Distribution
                  </h3>
                  <span className="text-xs text-emerald-600 font-bold">Aggregate: 92.4% (Grade A1)</span>
                </div>
                <div className="font-virgil text-sm text-[#fea619] dark:text-[#ffb95f] font-bold">
                  *Top 2% in Computer Science!
                </div>
              </div>

              {/* Progress Bars for Subjects */}
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Computer Science (Java)</span>
                    <span className="text-[#1c2ac8] dark:text-[#bdc2ff] font-bold">98%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#eaedff] dark:bg-[#262a40] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mathematics</span>
                    <span className="text-indigo-600 font-bold">96%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#eaedff] dark:bg-[#262a40] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Physics (Theory & Practical)</span>
                    <span className="text-emerald-600 font-bold">91%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#eaedff] dark:bg-[#262a40] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Chemistry</span>
                    <span className="text-amber-500 font-bold">89%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#eaedff] dark:bg-[#262a40] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '89%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>English Literature</span>
                    <span className="text-rose-500 font-bold">88%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#eaedff] dark:bg-[#262a40] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 9: STRUCTURED ACADEMIC MINDMAP & CISCE CURRICULUM TREE
          ========================================================================= */}
      <div id="curriculum-mindmap" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/10 text-teal-600 dark:text-teal-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            Pedagogical Structure
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            CISCE Curriculum Mindmap & Learning Trees
          </h2>
          <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 font-normal">
            Modular pedagogical trees connecting laboratory practicals, theoretical foundations, and board competencies.
          </p>
        </div>

        {/* Tree Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] shadow-sm">
          
          {/* Root Node */}
          <div className="flex justify-center mb-8">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1c2ac8] to-[#3b49df] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#1c2ac8]/25 text-center">
              <div>Senior Secondary CISCE Framework (Classes XI & XII)</div>
              <div className="text-[11px] font-normal text-white/80 mt-0.5">Lions Calcutta Greater Vidya Mandir</div>
            </div>
          </div>

          {/* 4 Pillars of the Mindmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Branch 1 */}
            <div className="p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42]">
              <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">biotech</span>
                <span>STEM Laboratory Core</span>
              </div>
              <ul className="text-xs space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Physics: Electrodynamics</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Chemistry: Organic Synthesis</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Biology: Genetics & Botany</span>
                </li>
              </ul>
            </div>

            {/* Branch 2 */}
            <div className="p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42]">
              <div className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span>Computing & Logic</span>
              </div>
              <ul className="text-xs space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Java OOP Paradigms</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Data Structures & Trees</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Boolean Algebra & Logic Gates</span>
                </li>
              </ul>
            </div>

            {/* Branch 3 */}
            <div className="p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42]">
              <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                <span>Mathematical Analysis</span>
              </div>
              <ul className="text-xs space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Differential & Integral Calculus</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Probability Distributions</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Vectors & 3D Geometry</span>
                </li>
              </ul>
            </div>

            {/* Branch 4 */}
            <div className="p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#292c42]">
              <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Humanities & Global Arts</span>
              </div>
              <ul className="text-xs space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Shakespearean Dramatic Literature</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Analytical Essay Writing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Environmental Geopolitics</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-[#e2e7ff] dark:border-[#24283d] text-center font-virgil text-sm text-[#fea619] dark:text-[#ffb95f] font-bold">
            ✦ All curricular nodes synced daily with the academic calendar and homework diary!
          </div>
        </div>

      </div>

      {/* =========================================================================
          DIV 10: INTERACTIVE ATTENDANCE HEATMAP & 30-DAY STREAK GRID
          ========================================================================= */}
      <div id="attendance-streak" className="py-16 sm:py-24 bg-[#faf8ff] dark:bg-[#151622] border-t border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                Biometric & Session Heatmap
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                30-Day Attendance Streak
              </h2>
              <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] space-y-2">
                <div className="flex items-center gap-2 text-2xl font-black text-emerald-600">
                  <span>🔥 18 Consecutive Days</span>
                </div>
                <div className="text-xs text-[#454655] dark:text-[#a0a4c0]">
                  Overall Term Attendance: <strong className="text-[#131b2e] dark:text-white">98.4%</strong> (88 of 90 days logged)
                </div>
              </div>
              <div className="font-virgil text-xs text-[#fea619] dark:text-[#ffb95f] mt-3 font-bold">
                *Keep above 85% to receive the Annual Gold Star pin!
              </div>
            </div>

            {/* 30-Day Grid */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40]">
              <div className="flex items-center justify-between mb-4 text-xs font-bold text-[#454655] dark:text-[#a0a4c0]">
                <span>Daily Log (Recent 30 Days)</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Present</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Leave</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700" /> Holiday</span>
                </div>
              </div>

              {/* 30 Day Heatmap Blocks */}
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const isHoliday = i % 7 === 5 || i % 7 === 6;
                  const isMedical = i === 11;
                  const isPresent = !isHoliday && !isMedical;

                  return (
                    <div
                      key={i}
                      title={`Day ${i + 1}: ${isPresent ? 'Present' : isMedical ? 'Approved Leave' : 'Weekend / Holiday'}`}
                      className={`h-9 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-transform hover:scale-105 cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isMedical
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-slate-200 dark:bg-[#25283d] text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#e2e7ff] dark:border-[#24283d] flex justify-between items-center text-xs">
                <span className="text-[#454655] dark:text-[#a0a4c0]">Morning gate biometric check synced with Go L1 Cache.</span>
                <Link href="/attendance" className="text-[#1c2ac8] dark:text-[#bdc2ff] font-bold hover:underline">
                  View Detailed Monthly Sheet →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 11: INTER-HOUSE CHAMPIONSHIP STANDINGS & SHIELD LEADERBOARD
          ========================================================================= */}
      <div id="house-shield" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            Inter-House Championship 2026
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            House Points & Shield Standings
          </h2>
          <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 font-normal">
            Four proud houses competing across Athletics, Debate, Science Olympiads, and Cultural Arts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Phoenix */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-red-500/10 to-transparent dark:from-red-950/20 border-2 border-red-500/40 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-3xl text-red-600">local_fire_department</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px]">
                  1ST PLACE 🏆
                </span>
              </div>
              <h3 className="text-xl font-black text-red-600 dark:text-red-400">Phoenix House</h3>
              <div className="text-3xl font-black text-[#131b2e] dark:text-white mt-1">1,240 pts</div>
              <p className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-2">
                +100 pts from Senior Football League Champions & Science Fair.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-red-500/20 text-[11px] font-bold text-red-600">
              House Captain: Aarav Sharma
            </div>
          </div>

          {/* Falcon */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-3xl text-blue-600">flight</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                  2ND PLACE
                </span>
              </div>
              <h3 className="text-xl font-black text-blue-600 dark:text-blue-400">Falcon House</h3>
              <div className="text-3xl font-black text-[#131b2e] dark:text-white mt-1">1,180 pts</div>
              <p className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-2">
                +60 pts from CISCE Debate Championships.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-blue-500/20 text-[11px] font-bold text-blue-600">
              House Captain: Riya Sen
            </div>
          </div>

          {/* Hercules */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-transparent dark:from-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-3xl text-emerald-600">fitness_center</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  3RD PLACE
                </span>
              </div>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">Hercules House</h3>
              <div className="text-3xl font-black text-[#131b2e] dark:text-white mt-1">1,110 pts</div>
              <p className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-2">
                +40 pts from Mathematics Olympiad Runners-up.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-emerald-500/20 text-[11px] font-bold text-emerald-600">
              House Captain: Rohan Das
            </div>
          </div>

          {/* Orion */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-3xl text-amber-500">stars</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                  4TH PLACE
                </span>
              </div>
              <h3 className="text-xl font-black text-amber-500 dark:text-amber-400">Orion House</h3>
              <div className="text-3xl font-black text-[#131b2e] dark:text-white mt-1">1,050 pts</div>
              <p className="text-xs text-[#454655] dark:text-[#a0a4c0] mt-2">
                +50 pts from Drama & Classical Music Troupe.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-amber-500/20 text-[11px] font-bold text-amber-600">
              House Captain: Ananya Bose
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 12: STUDENT DIGITAL HALL PASS & DYNAMIC QR SAFETY ENGINE
          ========================================================================= */}
      <div id="hallpass-engine" className="py-16 sm:py-24 bg-[#faf8ff] dark:bg-[#151622] border-t border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                Campus Safety Protocol
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Digital Hall Pass & Gate Security
              </h2>
              <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-2 font-normal">
                Encrypted corridor passes eliminate paper slips with dynamic security QR codes that expire automatically to prevent spoofing.
              </p>
              <div className="mt-6">
                <Link
                  href="/hallpass"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Request Instant Corridor Pass</span>
                </Link>
              </div>
            </div>

            {/* Active Simulation Card */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1c2b] border-2 border-purple-500/40 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e2e7ff] dark:border-[#262a40]">
                <div>
                  <div className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold">
                    PASS REF: HP-2026-0492
                  </div>
                  <div className="text-lg font-black text-[#131b2e] dark:text-white">Computer Science Laboratory</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-extrabold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                  <span>ACTIVE PASS</span>
                </div>
              </div>

              <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="text-center p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                  <div className="text-xs uppercase text-purple-600 font-bold tracking-wider">Remaining Time</div>
                  <div className="text-4xl font-mono font-black text-purple-700 dark:text-purple-300 mt-1">
                    {formatTime(hallPassSeconds)}
                  </div>
                  <div className="text-[11px] text-[#454655] dark:text-[#a0a4c0] mt-1">Authorized for 15 minutes</div>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#454655] dark:text-[#a0a4c0]">Student:</span>
                    <span className="font-bold text-[#131b2e] dark:text-white">{studentFirstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#454655] dark:text-[#a0a4c0]">Authorized By:</span>
                    <span className="font-bold text-[#131b2e] dark:text-white">Mrs. Sen (Dept Head)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#454655] dark:text-[#a0a4c0]">Issued At:</span>
                    <span className="font-mono">11:15 AM</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-purple-600 font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Dynamic Rotating QR Active</span>
                </div>
                <span className="text-emerald-600 font-bold">Corridor Sensors Clear</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 13: CAMPUS INFIRMARY & EMERGENCY HEALTH PROFILE
          ========================================================================= */}
      <div id="clinic-profile" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            Student Medical Safety
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Campus Infirmary & Emergency Health Cards
          </h2>
          <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-1 font-normal">
            Secure vital medical directives accessible by authorized school nurses during campus emergencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="material-symbols-outlined text-3xl">bloodtype</span>
              <h3 className="text-base font-extrabold text-[#131b2e] dark:text-white">Emergency Vitals</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#e2e7ff] dark:border-[#262a40]">
                <span className="text-[#454655] dark:text-[#a0a4c0]">Blood Group</span>
                <span className="font-extrabold text-rose-600 text-sm">O Positive (O+)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e2e7ff] dark:border-[#262a40]">
                <span className="text-[#454655] dark:text-[#a0a4c0]">Blood Pressure</span>
                <span className="font-bold">118 / 78 mmHg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#454655] dark:text-[#a0a4c0]">Resting Pulse</span>
                <span className="font-bold">72 bpm</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-base font-extrabold text-[#131b2e] dark:text-white">Allergy Alerts</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 font-semibold">
                ⚠️ Penicillin Sensitivity (High Alert)
              </div>
              <p className="text-[#454655] dark:text-[#a0a4c0] text-[11px]">
                Inhaler locker located at Infirmary Room 102. Authorized for self-administration during physical education.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
              <h3 className="text-base font-extrabold text-[#131b2e] dark:text-white">Doctor on Campus</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#131b2e] dark:text-white">Dr. Ananya Sen, MD (Pediatrics)</div>
              <div className="text-[#454655] dark:text-[#a0a4c0]">Resident School Physician • Wing 1</div>
              <div className="pt-2">
                <Link
                  href="/health"
                  className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center block transition-all"
                >
                  View Complete Medical File
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 14: DIRECT PARENT-TEACHER PORTAL & HELPDESK RESOLUTION THREAD
          ========================================================================= */}
      <div id="parent-ptm" className="py-16 sm:py-24 bg-[#faf8ff] dark:bg-[#151622] border-t border-[#e2e7ff] dark:border-[#222538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                Guardian Collaboration
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Parent-Teacher Helpdesk & PTM Booking
              </h2>
              <p className="text-sm sm:text-base text-[#454655] dark:text-[#a0a4c0] mt-2 font-normal">
                Direct asynchronous communication threads between guardians and subject faculties. Book one-on-one conference slots with zero friction.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/helpdesk"
                  className="px-5 py-3 rounded-full bg-[#1c2ac8] hover:bg-[#3b49df] text-white font-bold text-xs shadow-md transition-all"
                >
                  Write to School / Helpdesk
                </Link>
                <Link
                  href="/ptm"
                  className="px-5 py-3 rounded-full bg-white dark:bg-[#1a1c2b] text-[#1c2ac8] dark:text-[#bdc2ff] border border-[#e2e7ff] dark:border-[#262a40] font-bold text-xs transition-all"
                >
                  Reserve PTM Slot
                </Link>
              </div>
            </div>

            {/* Communication Thread Preview */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1a1c2b] border border-[#e2e7ff] dark:border-[#262a40] space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#454655] dark:text-[#a0a4c0]">
                Live Helpdesk Resolution Log #TKT-8812
              </div>

              {/* Message 1 */}
              <div className="p-3.5 rounded-2xl bg-[#faf8ff] dark:bg-[#141520] border border-[#e2e7ff] dark:border-[#262a40] text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#131b2e] dark:text-white">Guardian (Mrs. Sharma)</span>
                  <span className="text-[#454655] dark:text-[#a0a4c0] text-[10px]">Today, 09:12 AM</span>
                </div>
                <p className="text-[#454655] dark:text-[#c4c7e0]">
                  &ldquo;Kindly confirm the submission deadline for the Computer Science ICSE laboratory records.&rdquo;
                </p>
              </div>

              {/* Message 2 */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs ml-4 sm:ml-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Class Faculty (Mrs. Sen)</span>
                  <span className="text-blue-600 dark:text-blue-400 text-[10px]">Today, 09:30 AM (18m response)</span>
                </div>
                <p className="text-[#131b2e] dark:text-[#eaedff]">
                  &ldquo;Dear Mrs. Sharma, the hardcopy project evaluation is scheduled for next Thursday. Digital receipts are already logged on the portal.&rdquo;
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-emerald-600 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Resolution Completed</span>
                </span>
                <span className="text-[#454655] dark:text-[#a0a4c0] text-[11px]">Verified Parent Desk • 99.4% SLA Resolution</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          DIV 15: GRAND INSTITUTIONAL CTA, LEADERSHIP MESSAGE & CAMPUS FOOTER
          ========================================================================= */}
      <footer id="institutional-footer" className="bg-white dark:bg-[#0e0f17] border-t border-[#e2e7ff] dark:border-[#222538] pt-16 pb-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-12 sm:pb-16">
          
          {/* Institutional Grand Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1c2ac8] via-[#2a38db] to-[#121c87] text-white shadow-2xl relative overflow-hidden mb-16">
            <div className="relative z-10 max-w-3xl">
              <span className="text-amber-300 text-xs font-extrabold uppercase tracking-widest">
                Lions Calcutta Greater Vidya Mandir
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                Shaping Ethical Leadership, Academic Rigor & Technological Agility
              </h2>
              <p className="text-white/80 text-sm sm:text-base mt-3 leading-relaxed">
                Affiliated to the Council for the Indian School Certificate Examinations (CISCE), New Delhi.
                School Affiliation Code: WB-243. Empowering over 2,400 students across Primary, Middle, and Senior wings.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/chooser"
                  className="px-6 py-3.5 rounded-full bg-white text-[#1c2ac8] font-black text-sm shadow-lg hover:bg-slate-100 transition-all active:scale-95"
                >
                  Enter Portal Chooser
                </Link>
                <a
                  href="#hero"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Back to Top
                </a>
              </div>
            </div>
          </div>

          {/* Sitemaps & Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 text-xs">
            
            <div className="col-span-2">
              <Link href="/" title="NexaCampus Home" className="flex items-center gap-2.5 mb-3 hover:opacity-90 transition-opacity">
                <LogoEmblem className="h-8 w-8" />
                <span className="font-extrabold text-base text-[#1c2ac8] dark:text-[#bdc2ff]">
                  NexaCampus
                </span>
              </Link>
              <p className="text-[#454655] dark:text-[#a0a4c0] text-xs leading-relaxed max-w-sm">
                Official high-speed web application for Lions Calcutta Greater Vidya Mandir.
                Operates at &lt;3MB storage with instant cache warming and zero background battery drain.
              </p>
              <div className="mt-3 flex flex-col gap-1.5 text-xs text-[#454655] dark:text-[#a0a4c0]">
                <a href="tel:+913324371234" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-[#1c2ac8]">call</span>
                  <span>+91 33 2437 1234 / +91 91798 0679513</span>
                </a>
                <a href="mailto:office@lcgvm.edu.in" className="hover:text-[#1c2ac8] dark:hover:text-[#bdc2ff] transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-[#1c2ac8]">mail</span>
                  <span>office@lcgvm.edu.in</span>
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Go Engine Latency: 0.74ms</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#131b2e] dark:text-white mb-3">Academics</h4>
              <ul className="space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li><Link href="/attendance" className="hover:text-[#1c2ac8]">Attendance Tracker</Link></li>
                <li><Link href="/diary" className="hover:text-[#1c2ac8]">Homework &amp; Diary</Link></li>
                <li><Link href="/exams" className="hover:text-[#1c2ac8]">Exams &amp; Results</Link></li>
                <li><Link href="/library" className="hover:text-[#1c2ac8]">Digital Library</Link></li>
                <li><Link href="/timetable" className="hover:text-[#1c2ac8]">Class Timetable</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#131b2e] dark:text-white mb-3">Campus Life</h4>
              <ul className="space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li><Link href="/canteen" className="hover:text-[#1c2ac8]">Smart Canteen RFID</Link></li>
                <li><Link href="/bus" className="hover:text-[#1c2ac8]">Bus GPS Radar</Link></li>
                <li><Link href="/clubs" className="hover:text-[#1c2ac8]">Clubs &amp; Societies</Link></li>
                <li><Link href="/merits" className="hover:text-[#1c2ac8]">House Merits</Link></li>
                <li><Link href="/gallery" className="hover:text-[#1c2ac8]">Photo Gallery</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#131b2e] dark:text-white mb-3">Institutional</h4>
              <ul className="space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li><Link href="/health" className="hover:text-[#1c2ac8]">Clinic &amp; Vitals</Link></li>
                <li><Link href="/helpdesk" className="hover:text-[#1c2ac8]">Parent Desk &amp; PTM</Link></li>
                <li><Link href="/notices" className="hover:text-[#1c2ac8]">Circulars &amp; Notices</Link></li>
                <li><Link href="/store" className="hover:text-[#1c2ac8]">Campus Store</Link></li>
                <li><Link href="/chooser" className="hover:text-[#1c2ac8]">Role Switcher</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#131b2e] dark:text-white mb-3">Legal &amp; Compliance</h4>
              <ul className="space-y-2 text-[#454655] dark:text-[#c4c7e0]">
                <li><Link href="/privacy" className="hover:text-[#1c2ac8]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#1c2ac8]">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:text-[#1c2ac8]">Refund &amp; Billing</Link></li>
                <li><Link href="/cookies" className="hover:text-[#1c2ac8]">Cookie Inventory</Link></li>
                <li><Link href="/data-deletion" className="hover:text-[#1c2ac8]">Data Deletion (Right to Erasure)</Link></li>
              </ul>
            </div>

          </div>

          {/* Institutional Compliance & Registration Notice */}
          <div className="mt-12 pt-6 border-t border-[#e2e7ff] dark:border-[#222538] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#454655] dark:text-[#a0a4c0]">
            <p>
              © {new Date().getFullYear()} Lions Calcutta Greater Vidya Mandir (LCGVM). Managed by Lions Club of Calcutta Greater Education Trust. Affiliation WB-243.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/privacy" className="hover:text-[#1c2ac8] underline-offset-2 hover:underline">Privacy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#1c2ac8] underline-offset-2 hover:underline">Terms</Link>
              <span>•</span>
              <Link href="/refund" className="hover:text-[#1c2ac8] underline-offset-2 hover:underline">Refunds</Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-[#1c2ac8] underline-offset-2 hover:underline">Cookies</Link>
              <span>•</span>
              <Link href="/data-deletion" className="hover:text-[#1c2ac8] underline-offset-2 hover:underline">Data Deletion</Link>
            </div>
          </div>

        </div>

        {/* =========================================================================
            INSPIRUX-STYLE FULL-BLEED DISPLAY BRAND BANNER (BLUE & WHITE)
            Edge-to-edge vibrant Royal Blue block with crystal-clear, fully visible 'nexaCampus' display
            ========================================================================= */}
        <div className="relative w-full bg-[#1c2ac8] dark:bg-[#1622a5] text-white pt-10 sm:pt-14 md:pt-18 lg:pt-24 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-3 sm:px-6 md:px-10 select-none border-t border-[#1c2ac8] overflow-hidden">
          {/* Decorative coding & study artifacts — white specks, boxes and glyphs behind the wordmark */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {BANNER_GLYPHS.map((g) => (
              <span
                key={`g-${g.icon}-${g.left}`}
                className={`material-symbols-outlined absolute leading-none ${g.wide ? 'hidden sm:block' : ''}`}
                style={{
                  left: g.left,
                  top: g.top,
                  fontSize: `${g.size}px`,
                  opacity: g.opacity,
                  transform: g.rotate ? `rotate(${g.rotate}deg)` : undefined,
                }}
              >
                {g.icon}
              </span>
            ))}

            {BANNER_DOTS.map((d, i) => (
              <span
                key={`d-${d.left}-${i}`}
                className={`absolute ${d.round ? 'rounded-full' : ''} bg-white ${d.wide ? 'hidden sm:block' : ''}`}
                style={{
                  left: d.left,
                  top: d.top,
                  width: `${d.size}px`,
                  height: `${d.size}px`,
                  opacity: d.opacity,
                }}
              />
            ))}

            {BANNER_BOXES.map((b, i) => (
              <span
                key={`b-${b.left}-${i}`}
                className={`absolute border border-white rounded-[3px] ${b.wide ? 'hidden sm:block' : ''}`}
                style={{
                  left: b.left,
                  top: b.top,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  opacity: b.opacity,
                  transform: `rotate(${b.rotate ?? 0}deg)`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto flex items-center justify-center">
            <svg
              viewBox="0 0 1000 155"
              className="w-full h-auto select-none pointer-events-none drop-shadow-md"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="nexaCampus"
              role="img"
            >
              <text
                x="500"
                y="120"
                textAnchor="middle"
                textLength="920"
                lengthAdjust="spacing"
                fill="#ffffff"
                fontFamily="var(--font-poppins), 'Poppins', system-ui, -apple-system, sans-serif"
                fontSize="136"
                fontWeight="900"
                letterSpacing="-2"
              >
                nexaCampus
              </text>
            </svg>
          </div>
        </div>
      </footer>

    </div>
  );
}
