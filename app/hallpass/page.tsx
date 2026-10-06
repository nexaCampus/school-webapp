'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function HallPassPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Hall Pass" activePath="hallpass">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-space-md">
        {/* Active Pass Digital Card */}
        <section className="w-full bg-gradient-to-br from-tertiary to-[#006B49] rounded-[22px] p-space-lg text-white shadow-[0_16px_32px_-8px_rgba(0,80,54,0.5)] relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-widest bg-white/20 rounded-full px-2.5 py-1">
              PASS-9042 · ACTIVE
            </span>
            <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
          </div>
          <p className="font-display-lg-mobile text-display-lg-mobile mt-space-sm font-extrabold">
            12:41
          </p>
          <p className="font-body-md text-body-md opacity-90">remaining of 15 minutes</p>
          <div className="h-2 rounded-full bg-white/25 mt-space-sm overflow-hidden">
            <div className="h-full w-1/4 rounded-full bg-white animate-pulse"></div>
          </div>
          <p className="font-headline-sm text-headline-sm mt-space-md font-bold">
            Science Lab 3 (Optics Room)
          </p>
          <p className="font-body-sm text-body-sm opacity-85">
            Issued by Dr. Aris Thorne · 10:15 AM
          </p>
        </section>

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button className="flex-1 h-[48px] rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-white transition-colors text-[14px] font-bold shadow-sm">
            End Pass Early
          </button>
          <Link
            href="/home"
            className="flex-1 h-[48px] rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface text-[14px] font-bold flex items-center justify-center"
          >
            Return to Dashboard
          </Link>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center max-w-md leading-relaxed">
          Show this digital pass at any corridor checkpoint or proctor desk. The timer is verified against
          the school master clock.
        </p>
      </div>
    </PortalShell>
  );
}
