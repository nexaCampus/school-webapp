'use client';

import React, { useState, useEffect } from 'react';
import SchoolShowcaseCard, { SchoolRecord } from './SchoolShowcaseCard';
import DirectoryFilterDrawer, { FilterState } from './DirectoryFilterDrawer';
import SharePortalModal, { SchoolShareInfo } from './SharePortalModal';
import { fetchAllSchools } from '@/lib/api/makerClient';

export const SAMPLE_SCHOOLS: SchoolRecord[] = [
  {
    id: 'sch-1',
    name: 'Lions Calcutta Greater Vidyamandir',
    slug: 'lcgvm',
    affiliation: 'CISCE WB-243 / CBSE 1930281',
    board: 'ICSE',
    location: 'Kolkata, West Bengal',
    state: 'West Bengal',
    institutionType: 'Co-ed',
    studentStrength: '3,200 Scholars',
    established: 1991,
    annualFeeRange: '₹99.3K - ₹1.89L',
    portalUrl: '/',
    crestLetter: 'L',
    primaryColor: '#0A192F',
    accentBadge: 'Premier Flagship',
    motto: 'Tamaso Ma Jyotirgamaya (Knowledge is Light)',
  },
  {
    id: 'sch-2',
    name: 'Delhi Public Academy & Senior Secondary',
    slug: 'dpa-delhi',
    affiliation: 'CBSE Secondary Reg: 2710892',
    board: 'CBSE',
    location: 'Dwarka Sector 12, New Delhi',
    state: 'Delhi NCR',
    institutionType: 'Day Boarding',
    studentStrength: '2,850 Scholars',
    established: 1998,
    annualFeeRange: '₹1.15L - ₹1.65L',
    portalUrl: '/?tenant=dpa-delhi',
    crestLetter: 'D',
    primaryColor: '#1B382B',
    accentBadge: 'STEM Academy',
    motto: 'Service Before Self • Scientia Potentia Est',
  },
  {
    id: 'sch-3',
    name: 'Bangalore International Heritage School',
    slug: 'bihs-blr',
    affiliation: 'Cambridge Assessment CA-092 / IGCSE',
    board: 'Cambridge',
    location: 'Indiranagar, Bengaluru',
    state: 'Karnataka',
    institutionType: 'Co-ed',
    studentStrength: '1,450 Scholars',
    established: 2004,
    annualFeeRange: '₹1.80L - ₹2.90L',
    portalUrl: '/?tenant=bihs-blr',
    crestLetter: 'B',
    primaryColor: '#721121',
    accentBadge: 'IB Candidate',
    motto: 'In Pursuit of Global Wisdom and Integrity',
  },
  {
    id: 'sch-4',
    name: 'St. Augustine Collegiate High School',
    slug: 'sach-kol',
    affiliation: 'CISCE Code: WB-102',
    board: 'ICSE',
    location: 'Ballygunge Circular Road, Kolkata',
    state: 'West Bengal',
    institutionType: 'Co-ed',
    studentStrength: '2,100 Scholars',
    established: 1978,
    annualFeeRange: '₹88K - ₹1.45L',
    portalUrl: '/?tenant=sach-kol',
    crestLetter: 'S',
    primaryColor: '#1E3A8A',
    accentBadge: 'Heritage Convent',
    motto: 'Labor Omnia Vincit (Work Conquers All)',
  },
  {
    id: 'sch-5',
    name: 'Mumbai Model Higher Secondary School',
    slug: 'mmhs-mumbai',
    affiliation: 'Maharashtra State Board MH-8812',
    board: 'State Board',
    location: 'Bandra West, Mumbai',
    state: 'Maharashtra',
    institutionType: 'Co-ed',
    studentStrength: '3,400 Scholars',
    established: 1985,
    annualFeeRange: '₹65K - ₹1.10L',
    portalUrl: '/?tenant=mmhs-mumbai',
    crestLetter: 'M',
    primaryColor: '#312E81',
    accentBadge: 'Sports Champion',
    motto: 'Character, Discipline, Scientific Fortitude',
  },
  {
    id: 'sch-6',
    name: 'Bishop Cotton Centennial Academy',
    slug: 'bcca-delhi',
    affiliation: 'CBSE Code: 2710492',
    board: 'CBSE',
    location: 'Civil Lines, Delhi NCR',
    state: 'Delhi NCR',
    institutionType: 'Boys',
    studentStrength: '1,900 Scholars',
    established: 1965,
    annualFeeRange: '₹1.25L - ₹1.75L',
    portalUrl: '/?tenant=bcca-delhi',
    crestLetter: 'C',
    primaryColor: '#064E3B',
    accentBadge: 'Diamond Jubilee',
    motto: 'Overcoming by Faith and Rigorous Learning',
  },
];

function toBoardType(b?: string): 'CBSE' | 'ICSE' | 'Cambridge' | 'State Board' {
  if (!b) return 'ICSE';
  const upper = b.toUpperCase();
  if (upper.includes('CBSE')) return 'CBSE';
  if (upper.includes('ICSE') || upper.includes('CISCE')) return 'ICSE';
  if (upper.includes('CAMBRIDGE') || upper.includes('IB') || upper.includes('IGCSE')) return 'Cambridge';
  return 'State Board';
}

export default function ExploreCampusesGrid({
  schools: initialSchools = SAMPLE_SCHOOLS,
}: {
  schools?: SchoolRecord[];
}) {
  const [schoolsList, setSchoolsList] = useState<SchoolRecord[]>(initialSchools);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    board: 'All Boards',
    state: 'All States',
    type: 'All Types',
    feeRange: 'All Budgets',
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<SchoolShareInfo | null>(null);

  useEffect(() => {
    async function loadBackendSchools() {
      try {
        const backendSchools = await fetchAllSchools();
        if (backendSchools && backendSchools.length > 0) {
          const mapped: SchoolRecord[] = backendSchools.map((s, idx) => {
            const teacherNum = parseInt(String(s.teacher_count || '50'), 10) || 50;
            const scholarsStr = s.enrolled_scholars ? String(s.enrolled_scholars) : `${teacherNum * 30}`;
            return {
              id: `sch-db-${idx}-${s.subdomain_slug}`,
              name: s.school_name,
              slug: s.subdomain_slug,
              affiliation: `${s.affiliation_board || 'CBSE/CISCE'} • ${teacherNum} Faculty`,
              board: toBoardType(s.affiliation_board),
              location: `${s.city}, ${s.state_territory}`,
              state: s.state_territory || 'West Bengal',
              institutionType: 'Co-ed',
              studentStrength: `${scholarsStr} Scholars`,
              established: 2026,
              annualFeeRange: '₹85K - ₹1.75L',
              portalUrl: s.subdomain_slug === 'lcgvm' ? '/' : `/school/${s.subdomain_slug}`,
              crestLetter: (s.school_name || 'N')[0].toUpperCase(),
              primaryColor: '#0A192F',
              accentBadge: s.subdomain_slug === 'lcgvm' ? 'Premier Flagship' : 'Autonomous Campus',
              motto: s.school_motto || 'Knowledge is Light',
            };
          });

          const existingSlugs = new Set(mapped.map((m) => m.slug));
          const combined = [
            ...mapped,
            ...initialSchools.filter((s) => !existingSlugs.has(s.slug)),
          ];
          setSchoolsList(combined);
        }
      } catch (err) {
        console.warn('Could not load schools from Go backend:', err);
      }
    }
    loadBackendSchools();
  }, [initialSchools]);

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilters({
      board: 'All Boards',
      state: 'All States',
      type: 'All Types',
      feeRange: 'All Budgets',
    });
    setSearchTerm('');
  };

  const filteredSchools = schoolsList.filter((sch) => {
    const matchesSearch =
      sch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.affiliation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBoard = filters.board === 'All Boards' || sch.board === filters.board;
    const matchesState = filters.state === 'All States' || sch.state === filters.state;
    const matchesType = filters.type === 'All Types' || sch.institutionType === filters.type;

    return matchesSearch && matchesBoard && matchesState && matchesType;
  });

  return (
    <div className="w-full font-sans">
      {/* Top Explorer Banner */}
      <div className="bg-oxford dark:bg-[#070913] text-white py-12 px-6 border-b border-slate-800 dark:border-[#1a1d2e] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-widest">
              Multi-Tenant Institutional Federation
            </span>
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-white">
              Explore Campuses on NexaCampus Cloud
            </h1>
            <p className="text-xs md:text-sm text-slate-300 dark:text-slate-400 max-w-2xl">
              Discover accredited Indian &amp; International institutions sharing standardized public portals, verifiable disclosures, and digital admissions on NexaCampus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/maker"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-2"
            >
              <span>Provision Your School (+ Add)</span>
              <span className="text-xs">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Filter & Explorer Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Mobile Filter Trigger Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search school name, city, board affiliation..."
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#262a40] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-oxford dark:focus:ring-[#3b49df] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs transition-colors"
            />
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2.5 bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#262a40] rounded-lg text-xs font-bold text-oxford dark:text-white flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>
        </div>

        {/* Layout Grid: Desktop Sidebar + 3-Column Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Filter Column */}
          <div className="lg:col-span-3">
            <DirectoryFilterDrawer
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              mobileOpen={mobileFilterOpen}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>

          {/* Right School Showcase Cards Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Showing {filteredSchools.length} Accredited Institutions</span>
              <span>All Campuses Verified Active</span>
            </div>

            {filteredSchools.length === 0 ? (
              <div className="bg-white dark:bg-[#151622] p-12 text-center rounded-xl border border-slate-200 dark:border-[#262a40] shadow-xs">
                <div className="text-3xl mb-2">🏛️</div>
                <h3 className="font-serif font-bold text-base text-slate-800 dark:text-white">
                  No Institutions Match Current Filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  Try adjusting the board, state, or search terms to explore other accredited schools.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-oxford dark:bg-[#3b49df] hover:bg-slate-800 dark:hover:bg-[#2d38be] text-white rounded text-xs font-bold transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <SchoolShowcaseCard
                    key={school.id}
                    school={school}
                    onShare={(sch) =>
                      setShareTarget({
                        name: sch.name,
                        slug: sch.slug,
                        affiliation: sch.affiliation,
                        location: sch.location,
                        url: sch.portalUrl,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {shareTarget && (
        <SharePortalModal school={shareTarget} onClose={() => setShareTarget(null)} />
      )}
    </div>
  );
}
