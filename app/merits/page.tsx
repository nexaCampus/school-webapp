'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

const MERIT_AWARDS = [
  {
    pts: '+20',
    title: 'Inter-House Quiz Champions',
    details: 'Oct 01 · First Place Team Trophy',
    icon: 'emoji_events',
    accentBg: 'bg-tertiary/10',
    accentColor: 'text-tertiary',
  },
  {
    pts: '+15',
    title: 'Science Exhibition Exhibit',
    details: 'Sep 26 · Optics working model distinction',
    icon: 'science',
    accentBg: 'bg-primary/10',
    accentColor: 'text-primary',
  },
  {
    pts: '+10',
    title: 'Football Semifinal Appearance',
    details: 'Sep 18 · Full squad athletic contribution',
    icon: 'sports_soccer',
    accentBg: 'bg-secondary/10',
    accentColor: 'text-secondary dark:text-[#ffb95f]',
  },
  {
    pts: '+15',
    title: 'Mathematics Olympiad Stage 1',
    details: 'Sep 12 · Distinction in State Round',
    icon: 'functions',
    accentBg: 'bg-primary-fixed',
    accentColor: 'text-primary',
  },
  {
    pts: '+10',
    title: 'Campus Green Volunteer Hours',
    details: 'Aug 29 · 20 hours community tree planting',
    icon: 'volunteer_activism',
    accentBg: 'bg-tertiary-fixed/30',
    accentColor: 'text-tertiary',
  },
  {
    pts: '+10',
    title: 'Full Attendance Honor Roll',
    details: 'Aug 01 · Zero unexcused absences',
    icon: 'verified',
    accentBg: 'bg-secondary-container/20',
    accentColor: 'text-secondary dark:text-[#ffb95f]',
  },
];

export default function MeritsPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Merits &amp; Badges" activePath="merits">
      <div className="flex flex-col gap-space-lg">
        {/* House Points Hero Card */}
        <section className="bg-gradient-to-br from-secondary-container to-[#F59E0B] rounded-lg p-space-lg text-on-secondary-fixed shadow-[0_12px_28px_-6px_rgba(254,166,25,0.4)] relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/20"></div>
          <div>
            <p className="font-label-sm text-label-sm font-bold tracking-widest opacity-80">
              BLUE HOUSE · SHIVAJI COHORT
            </p>
            <p className="font-display-lg-mobile text-display-lg-mobile mt-1 font-extrabold">248 pts</p>
            <p className="font-body-md text-body-md opacity-90">Rank 2 of 4 houses in current term</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px]">military_tech</span>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider">House Shield</p>
              <p className="text-[15px] font-bold">12 pts behind Leaders</p>
            </div>
          </div>
        </section>

        {/* Awards Responsive Grid: 1 col on mobile, 2 on tablet, 3 on laptop */}
        <section className="flex flex-col gap-3">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Point Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MERIT_AWARDS.map((award, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex items-start gap-3.5 hover:shadow-md transition-shadow"
              >
                <span
                  className={`w-12 h-12 rounded-[14px] ${award.accentBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`material-symbols-outlined ${award.accentColor} text-[24px]`}>
                    {award.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-primary">{award.pts}</span>
                    <span className="text-[10px] uppercase font-bold text-outline">Verified</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-on-surface leading-snug mt-1">
                    {award.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {award.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
