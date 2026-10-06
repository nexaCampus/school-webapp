'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

const ALBUMS = [
  {
    title: "Annual Fest '26",
    photos: '84 photos',
    gradient: 'from-secondary-container to-[#F59E0B]',
    textColor: 'text-on-secondary-fixed',
  },
  {
    title: 'Science Expo',
    photos: '56 photos',
    gradient: 'from-tertiary-fixed to-tertiary',
    textColor: 'text-white',
  },
  {
    title: 'Sports Day 2026',
    photos: '112 photos',
    gradient: 'from-primary-fixed to-primary-container',
    textColor: 'text-white',
  },
  {
    title: "Founder's Day",
    photos: '47 photos',
    gradient: 'from-surface-container-high to-surface-tint',
    textColor: 'text-on-surface',
  },
  {
    title: 'Robotics Showcase',
    photos: '38 photos',
    gradient: 'from-primary to-[#2a38e8]',
    textColor: 'text-white',
  },
  {
    title: 'Art & Craft Exhibition',
    photos: '65 photos',
    gradient: 'from-secondary to-secondary-container',
    textColor: 'text-white',
  },
];

export default function GalleryPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Photo Gallery" activePath="gallery">
      <div className="flex flex-col gap-space-lg">
        {/* Yearbook Hero Banner */}
        <section className="rounded-[22px] overflow-hidden relative h-48 bg-gradient-to-br from-primary via-primary-container to-[#1D2CC9] p-space-lg flex flex-col justify-end shadow-[0_12px_28px_-6px_rgba(28,42,200,0.4)]">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute right-8 bottom-6 flex gap-1">
            <span className="material-symbols-outlined text-secondary-fixed text-[24px]">star</span>
            <span className="material-symbols-outlined text-white text-[24px]">school</span>
            <span className="material-symbols-outlined text-secondary-fixed text-[24px]">star</span>
          </div>
          <p className="font-label-sm text-label-sm font-bold tracking-widest text-white/80">
            CLASS OF 2027
          </p>
          <h2 className="font-display-lg-mobile text-display-lg-mobile text-white font-extrabold">
            Campus Moments &amp; Digital Yearbook
          </h2>
        </section>

        {/* Albums Responsive Grid: 2 on mobile, 3 on tablet, 4 on laptop */}
        <section className="flex flex-col gap-3">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Event Albums</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALBUMS.map((a, idx) => (
              <div
                key={idx}
                className={`rounded-[18px] overflow-hidden h-36 bg-gradient-to-br ${a.gradient} p-4 flex flex-col justify-end shadow-sm hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <p className={`text-[14px] font-bold ${a.textColor}`}>{a.title}</p>
                <p className={`font-body-sm text-[12px] opacity-80 ${a.textColor}`}>{a.photos}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
