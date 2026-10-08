'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import { goApi } from '@/lib/goApiClient';
import type { BusTravelData } from '@/lib/goApiTypes';

export default function BusPage() {
  const [bus, setBus] = useState<BusTravelData | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    goApi.getBusTravel().then(setBus);
  }, []);

  const routeNo = bus?.routeNumber || 'ROUTE 14-A';
  const plate = bus?.vehiclePlate || 'WB-02-AK-9821';
  const eta = bus?.etaMinutes ?? 7;
  const nextStop = bus?.nextStopName || 'Ultadanga Crossing';
  const driver = bus?.driverName || 'Rajeshwar Singh';
  const phone = bus?.driverPhone || '+91 98312 45890';
  const myStop = bus?.studentStopName || 'Ultadanga Junction';
  const pickupTime = bus?.studentScheduledTime || '07:35 AM';

  return (
    <PortalShell title="Bus Tracking" activePath="bus">
      <div className="flex flex-col gap-space-md">
        {/* Live Route Hero Card */}
        <section className="relative bg-gradient-to-br from-primary to-primary-container rounded-lg p-space-lg text-white overflow-hidden shadow-[0_12px_28px_-6px_rgba(28,42,200,0.35)]">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10"></div>
          <p className="font-label-sm text-label-sm font-bold tracking-widest opacity-80">
            {routeNo} · {plate}
          </p>
          <p className="font-display-lg-mobile text-display-lg-mobile mt-1">{eta} min away</p>
          <p className="font-body-md text-body-md opacity-90 mt-0.5">
            Next stop: {nextStop} • On Time
          </p>
          <div className="h-2 rounded-full bg-white/25 mt-space-md overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-white animate-pulse"></div>
          </div>
        </section>

        {/* 2 Column Details on Tablet/Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant text-[24px]">person</span>
              </span>
              <div>
                <p className="text-[15px] font-bold text-on-surface">{driver}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Designated Driver · {routeNo}
                </p>
              </div>
            </div>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="w-11 h-11 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center hover:bg-tertiary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </a>
          </div>

          <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-secondary text-[24px]">pin_drop</span>
            </span>
            <div>
              <p className="text-[15px] font-bold text-on-surface">Your Stop: {myStop}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Scheduled Pickup: {pickupTime} • Drop: 03:15 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
