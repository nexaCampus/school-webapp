'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

const ITEMS = [
  {
    title: 'Black Casio Scientific Calculator (fx-991EX)',
    location: 'Room 402, 3rd Bench · Oct 02',
    icon: 'calculate',
    tag: 'Found',
    accentBg: 'bg-secondary-container/20',
    accentText: 'text-secondary',
  },
  {
    title: 'Blue Milton Tiffin Box (Insulated Steel)',
    location: 'Canteen Counter 1 · Sep 30',
    icon: 'lunch_dining',
    tag: 'Found',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
  },
  {
    title: 'Class 12 Physics Lab Journal (Spiral Bound)',
    location: 'Physics Lab 3 · Sep 28',
    icon: 'menu_book',
    tag: 'Found',
    accentBg: 'bg-tertiary/10',
    accentText: 'text-tertiary',
  },
  {
    title: 'Black Titan Octane Wristwatch',
    location: 'Main Sports Complex · Sep 25',
    icon: 'watch',
    tag: 'Lost',
    accentBg: 'bg-error/10',
    accentText: 'text-error',
  },
];

export default function LostFoundPage() {
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Lost &amp; Found" activePath="lostfound">
      <div className="flex flex-col gap-space-md">
        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2">
            {['All', 'Found', 'Lost', 'Claimed'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                  filter === t
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="h-[44px] px-6 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Report Lost Item</span>
          </button>
        </div>

        {/* Responsive Items Grid: 1 col on mobile, 2 on tablet, 3 on laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-space-xs">
          {ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-12 h-12 rounded-[14px] ${item.accentBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`material-symbols-outlined ${item.accentText} text-[24px]`}>
                    {item.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {item.tag}
                  </span>
                  <h3 className="text-[15px] font-bold text-on-surface mt-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-outline">Proctor Desk Verification</span>
                <button className="text-[12px] font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors rounded-full px-4 py-1">
                  Claim Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
