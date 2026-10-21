'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearSession, getSession, type Session } from '@/lib/session';
import LogoEmblem from '@/components/LogoEmblem';
import AuthFooter from '@/components/AuthFooter';
import DarkModeToggle from '@/components/DarkModeToggle';
import PublicHeader from '@/components/public/PublicHeader';
import { useTenant } from '@/lib/context/TenantContext';
import { searchSchools, fetchAllSchools, SchoolTenant } from '@/lib/api/makerClient';

function UniversalChooserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenant, isPlatformRoot, setTenantSlug } = useTenant();

  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolTenant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SchoolTenant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [isPending, startTransition] = useTransition();

  // Redirect query param if intercepted by middleware
  const redirectParam = searchParams.get('redirect') || '/home';
  const queryTenantSlug = searchParams.get('tenant') || searchParams.get('school');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = selectedSchool
        ? `Sign In to ${selectedSchool.school_name} | NexaCampus`
        : 'Select Your School Campus | NexaCampus Gateway';
    }
    const s = getSession();
    if (s?.student || s?.name) {
      setActiveSession(s);
    }
  }, [selectedSchool]);

  // Only preselect school if a tenant query param is in the URL (e.g. /chooser?tenant=greenwood or /chooser?tenant=lcgvm)
  useEffect(() => {
    if (queryTenantSlug) {
      fetchAllSchools().then((schools) => {
        const match = schools.find((s) => s.subdomain_slug.toLowerCase() === queryTenantSlug.toLowerCase());
        if (match) {
          setSelectedSchool(match);
        }
      });
    } else {
      setSelectedSchool(null);
      setTenantSlug(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nexacampus_tenant_slug');
        document.cookie = 'school_tenant_slug=; path=/; max-age=0; SameSite=Lax';
      }
    }
  }, [queryTenantSlug, setTenantSlug]);

  // Initial load of default schools if searching
  useEffect(() => {
    let active = true;
    if (!searchQuery.trim()) {
      fetchAllSchools().then((schools) => {
        if (active) setSearchResults(schools);
      });
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchSchools(searchQuery.trim());
        if (active) {
          setSearchResults(results);
          setIsSearching(false);
        }
      } catch {
        if (active) setIsSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSelectSchool = (school: SchoolTenant) => {
    setSelectedSchool(school);
    setTenantSlug(school.subdomain_slug);
  };

  const handleChangeSchool = () => {
    setSelectedSchool(null);
    setSearchQuery('');
    setTenantSlug(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexacampus_tenant_slug');
      document.cookie = 'school_tenant_slug=; path=/; max-age=0; SameSite=Lax';
    }
    router.replace('/chooser');
  };

  const handleSelectMethod = () => {
    if (activeSession) {
      clearSession();
    }
  };

  const effectiveSlug = selectedSchool?.subdomain_slug || queryTenantSlug || '';
  const schoolName = selectedSchool?.school_name || 'NexaCampus Unified Gateway';
  const board = selectedSchool?.affiliation_board || 'All Boards';
  const motto = selectedSchool?.school_motto || 'Autonomous Multi-Tenant School Cloud Infrastructure';
  const location = selectedSchool ? `${selectedSchool.city}, ${selectedSchool.state_territory}` : 'Pan-India Campuses';

  return (
    <>
      {/* ========================================================
          MOBILE VIEW (< 768px): Dynamic Bottom Sheet Layout
          ======================================================== */}
      <div className="md:hidden relative min-h-screen bg-gradient-to-b from-[#1c2ac8] via-[#121c88] to-[#0a1040] flex flex-col justify-between overflow-x-hidden font-sans">
        {/* Top Area: School Branding with Crest & Dark Mode */}
        <div className="relative pt-safe px-4 pb-6 flex flex-col justify-between min-h-[24vh] flex-shrink-0 overflow-hidden">
          <div className="flex items-center justify-between pt-2 relative z-10">
            <Link href="/" title="Back to Home" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <LogoEmblem className="h-7 w-7 shadow-sm" />
              <span className="text-[12px] font-extrabold text-white tracking-wider uppercase">
                {selectedSchool ? selectedSchool.subdomain_slug.toUpperCase() : 'NEXACAMPUS'}
              </span>
            </Link>
            <DarkModeToggle className="bg-white/15 dark:bg-[#151622] text-white border-white/20 hover:bg-white/25" />
          </div>

          <div className="flex flex-col items-center text-center mt-2 relative z-10">
            <h2 className="text-[16px] font-extrabold text-white leading-tight">
              {selectedSchool ? selectedSchool.school_name : 'Select Your School Campus'}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-amber-300 bg-white/15 rounded-full px-2.5 py-0.5 border border-white/20">
                {selectedSchool ? `${selectedSchool.affiliation_board} Affiliated • ${selectedSchool.city}` : 'Multi-Tenant Academic Gateway • Pan-India'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Area */}
        <div className="w-full bg-surface dark:bg-[#12131a] rounded-t-[34px] shadow-[0_-16px_40px_rgba(0,0,0,0.5)] border-t border-outline/10 dark:border-[#222538] px-4 pt-4 pb-safe flex-1 flex flex-col justify-between z-20 min-h-[76vh] overflow-y-auto">
          <div className="w-10 h-1 rounded-full bg-outline/25 mx-auto mb-3 flex-shrink-0" />

          {/* If No School Selected: Search Step */}
          {!selectedSchool ? (
            <div className="space-y-4">
              <div className="text-center">
                <h1 className="text-lg font-extrabold text-on-surface">Find Your School Campus</h1>
                <p className="text-xs text-on-surface-variant mt-0.5">Search by name, city, or subdomain slug</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Greenwood, LCGVM, Kolkata..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-outline/20 bg-surface-container-low dark:bg-[#181a26] text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-[#1c2ac8]"
                  autoFocus
                />
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-2.5">
                  search
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {searchResults.map((sch) => (
                  <button
                    key={sch.subdomain_slug}
                    onClick={() => handleSelectSchool(sch)}
                    className="w-full text-left p-3 rounded-xl border border-outline/10 dark:border-[#222538] bg-surface-container-lowest dark:bg-[#151622] hover:border-[#1c2ac8] transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-on-surface">{sch.school_name}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        {sch.subdomain_slug}.nexacampus.tech • {sch.city}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1c2ac8]">Select →</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* School Selected: Role Selector & Auth Options */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-surface-container-low dark:bg-[#181a26] p-2.5 rounded-xl border border-outline/10">
                <div className="truncate">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-mono">Selected Campus</span>
                  <span className="text-xs font-bold text-on-surface truncate block">{schoolName}</span>
                </div>
                <button
                  onClick={handleChangeSchool}
                  className="text-[11px] font-bold text-[#1c2ac8] dark:text-[#bdc2ff] hover:underline px-2 py-1 flex-shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Role Toggle Tabs */}
              <div className="grid grid-cols-2 p-1 bg-surface-container-high dark:bg-[#181a26] rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveRole('student')}
                  className={`py-2 rounded-lg transition-all ${
                    activeRole === 'student'
                      ? 'bg-[#1c2ac8] text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Student &amp; Parent
                </button>
                <button
                  onClick={() => setActiveRole('admin')}
                  className={`py-2 rounded-lg transition-all ${
                    activeRole === 'admin'
                      ? 'bg-[#721121] text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Admin &amp; Faculty
                </button>
              </div>

              {/* Dynamic Auth Method Cards */}
              <div className="space-y-3">
                {activeRole === 'student' ? (
                  <>
                    <Link
                      href={`/admission?tenant=${effectiveSlug}`}
                      onClick={handleSelectMethod}
                      className="w-full bg-surface-container-lowest dark:bg-[#151622] rounded-2xl border border-outline/10 p-3.5 flex items-center gap-3 active:scale-[0.99] transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[22px]">badge</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-on-surface">Admission Number</div>
                        <div className="text-[10px] text-on-surface-variant">Issued on student ID card &amp; fee receipt</div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-[18px]">arrow_forward</span>
                    </Link>

                    <Link
                      href={`/email?tenant=${effectiveSlug}`}
                      onClick={handleSelectMethod}
                      className="w-full bg-surface-container-lowest dark:bg-[#151622] rounded-2xl border border-outline/10 p-3.5 flex items-center gap-3 active:scale-[0.99] transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[22px]">mail</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-on-surface">Email or Google Account</div>
                        <div className="text-[10px] text-on-surface-variant">Guardian or student verified email</div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-[18px]">arrow_forward</span>
                    </Link>
                  </>
                ) : (
                  /* Admin Role: Strictly Email/Google Account — Admission Number Blocked */
                  <>
                    <Link
                      href={`/admin?tenant=${effectiveSlug}`}
                      onClick={handleSelectMethod}
                      className="w-full bg-surface-container-lowest dark:bg-[#151622] rounded-2xl border border-[#721121]/30 p-3.5 flex items-center gap-3 active:scale-[0.99] transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-on-surface">Institutional Staff &amp; Principal Sign In</div>
                        <div className="text-[10px] text-on-surface-variant">Authorised staff Google or administrative email</div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-[18px]">arrow_forward</span>
                    </Link>

                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
                      <span>Admission number sign-in is disabled for the administrative portal.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-outline/10 text-center text-[10px] text-on-surface-variant">
            <span>Powered by NexaCampus Autonomous Multi-Tenant OS</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (>= 768px): Laptop Split Card with Spotlight Search
          ======================================================== */}
      <div className="hidden md:flex relative min-h-screen bg-surface flex-col justify-between w-full overflow-y-auto font-sans">
        {/* Full Institutional Header Navigation */}
        <PublicHeader />

        {/* Centered Split Card Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 w-full relative z-10">
          <div className="w-full max-w-5xl mx-auto bg-surface-container-lowest dark:bg-[#151622] rounded-3xl shadow-[0_24px_70px_-12px_rgba(0,0,0,0.5)] border border-outline/10 dark:border-[#222538] overflow-hidden grid grid-cols-12 relative z-10 min-h-[540px]">
            {/* Left Branding Rail */}
            <div className="col-span-5 bg-gradient-to-br from-primary via-[#2435df] to-[#121c88] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                {selectedSchool ? (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>{selectedSchool.affiliation_board} Accredited Gateway</span>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                      {selectedSchool.school_name}
                    </h2>

                    <p className="text-xs text-white/80 font-serif italic">
                      &ldquo;{selectedSchool.school_motto || 'Knowledge & Excellence'}&rdquo;
                    </p>

                    <div className="pt-2 text-xs font-mono text-white/70 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Location:</span>
                        <span>{selectedSchool.city}, {selectedSchool.state_territory}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Subdomain:</span>
                        <span className="text-amber-300">{selectedSchool.subdomain_slug}.nexacampus.tech</span>
                      </div>
                    </div>

                    <button
                      onClick={handleChangeSchool}
                      className="mt-3 text-xs font-bold text-amber-300 hover:text-white underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                    >
                      <span>⇄ Search Different School</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>NexaCampus Global Gateway</span>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                      Select Your School Campus
                    </h2>

                    <p className="text-xs text-white/85 leading-relaxed">
                      Connect to your institution&apos;s digital campus. Access attendance, examinations, fee remittance, smart canteen, and academic diaries securely.
                    </p>

                    <div className="pt-2 text-xs font-mono text-white/75 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-amber-300">domain</span>
                        <span>100+ Partner Campuses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-amber-300">school</span>
                        <span>CBSE • CISCE • Cambridge • State</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-amber-300">link</span>
                        <span className="text-amber-300 font-mono">&lt;school-abbreviation&gt;.nexacampus.tech</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Left Rail Security Bullets */}
              <div className="relative z-10 py-4 border-t border-white/15 space-y-2 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-300">verified</span>
                  <span>Role-Segregated Authentication Guard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-300">security</span>
                  <span>256-Bit Cryptographic Session Tokens</span>
                </div>
              </div>
            </div>

            {/* Right Action Rail */}
            <div className="col-span-7 p-8 md:p-10 flex flex-col justify-between">
              {/* Step 1: Spotlight School Search (If none selected) */}
              {!selectedSchool ? (
                <div className="space-y-5 my-auto">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span>Step 1 of 2</span>
                    </div>
                    <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                      Search Your School Campus
                    </h1>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Type your school name or subdomain identifier to select your institutional portal.
                    </p>
                  </div>

                  {/* Spotlight Search Box */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Greenwood, LCGVM, Kolkata, Delhi..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-outline/20 bg-surface-container-low dark:bg-[#181a26] text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-[#1c2ac8] shadow-sm"
                      autoFocus
                    />
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3.5 top-3.5">
                      search
                    </span>
                  </div>

                  {/* Search Results List */}
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {searchResults.map((sch) => (
                      <div
                        key={sch.subdomain_slug}
                        onClick={() => handleSelectSchool(sch)}
                        className="p-3.5 rounded-2xl border border-outline/10 hover:border-[#1c2ac8] bg-surface-container-lowest dark:bg-[#181a26] hover:bg-[#faf8ff] dark:hover:bg-[#1e2133] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-oxford text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {sch.subdomain_slug.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-on-surface group-hover:text-[#1c2ac8]dark:group-hover:text-[#bdc2ff] transition-colors">
                              {sch.school_name}
                            </div>
                            <div className="text-[11px] text-on-surface-variant font-mono">
                              {sch.subdomain_slug}.nexacampus.tech • {sch.city}, {sch.state_territory}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#1c2ac8] group-hover:translate-x-1 transition-transform">
                          Select →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Step 2: Role-Segregated Method Selector */
                <div className="space-y-5 my-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-outline/10">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <span>Step 2: Authenticate</span>
                      </div>
                      <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                        Select Sign-In Portal
                      </h1>
                    </div>

                    <button
                      onClick={handleChangeSchool}
                      className="text-xs font-bold text-[#1c2ac8] dark:text-[#bdc2ff] hover:underline cursor-pointer"
                    >
                      Change Campus
                    </button>
                  </div>

                  {/* Role Switcher Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-surface-container-high dark:bg-[#181a26] rounded-2xl text-xs font-bold">
                    <button
                      onClick={() => setActiveRole('student')}
                      className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                        activeRole === 'student'
                          ? 'bg-[#1c2ac8] text-white shadow-md'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Student / Guardian Portal
                    </button>
                    <button
                      onClick={() => setActiveRole('admin')}
                      className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                        activeRole === 'admin'
                          ? 'bg-[#721121] text-white shadow-md'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      School Admin &amp; Staff Portal
                    </button>
                  </div>

                  {/* Methods Cards */}
                  <div className="space-y-3.5">
                    {activeRole === 'student' ? (
                      <>
                        <Link
                          href={`/admission?tenant=${effectiveSlug}&redirect=${encodeURIComponent(redirectParam)}`}
                          onClick={handleSelectMethod}
                          className="p-4 rounded-2xl border border-outline/10 hover:border-[#1c2ac8] bg-surface-container-lowest dark:bg-[#181a26] flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                              <span className="material-symbols-outlined text-[24px]">badge</span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                                Admission Number
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                Printed on student ID card, hall ticket &amp; fee receipts
                              </div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
                            arrow_forward
                          </span>
                        </Link>

                        <Link
                          href={`/email?tenant=${effectiveSlug}&redirect=${encodeURIComponent(redirectParam)}`}
                          onClick={handleSelectMethod}
                          className="p-4 rounded-2xl border border-outline/10 hover:border-emerald-600 bg-surface-container-lowest dark:bg-[#181a26] flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[24px]">mail</span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-on-surface group-hover:text-emerald-600 transition-colors">
                                Email / Google Account
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                Sign in with registered guardian or student email
                              </div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-outline group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                            arrow_forward
                          </span>
                        </Link>
                      </>
                    ) : (
                      /* Admin Role: Strictly Email/Google Account — Admission Number Blocked */
                      <>
                        <Link
                          href={`/admin?tenant=${effectiveSlug}&redirect=${encodeURIComponent(redirectParam)}`}
                          onClick={handleSelectMethod}
                          className="p-4 rounded-2xl border border-[#721121]/30 hover:border-[#721121] bg-surface-container-lowest dark:bg-[#181a26] flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-on-surface group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                                Staff &amp; Administrator Sign In
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                Direct Google OAuth or institutional administrator email
                              </div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-outline group-hover:text-rose-700 group-hover:translate-x-1 transition-all">
                            arrow_forward
                          </span>
                        </Link>

                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2 font-mono">
                          <span className="material-symbols-outlined text-[18px] text-amber-600">lock</span>
                          <span>Admission numbers are strictly disallowed for administrative privileges.</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Support Link */}
              <div className="pt-4 border-t border-outline/10 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Need support logging in?</span>
                <Link href="/helpdesk" className="text-[#1c2ac8] dark:text-[#bdc2ff] font-bold hover:underline">
                  Contact Campus Administration →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <AuthFooter />
      </div>
    </>
  );
}

export default function UniversalChooserPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-on-surface">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-xs font-semibold text-outline">Loading Campus Gateway...</span>
          </div>
        </div>
      }
    >
      <UniversalChooserContent />
    </React.Suspense>
  );
}
