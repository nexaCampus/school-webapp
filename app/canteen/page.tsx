'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function CanteenPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Canteen" activePath="canteen">
      <div className="flex flex-col gap-space-lg">
        {/* Wallet Hero Card */}
        <section className="bg-gradient-to-br from-primary to-primary-container rounded-lg p-space-lg text-white shadow-[0_12px_28px_-6px_rgba(28,42,200,0.35)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-label-sm text-label-sm font-bold tracking-widest opacity-80">
              SMART ID WALLET
            </p>
            <p className="font-display-lg-mobile text-display-lg-mobile mt-1 font-extrabold">₹42.50</p>
            <p className="font-body-md text-body-md opacity-90 mt-0.5">
              Spent today ₹6.20 of ₹15.00 daily limit
            </p>
            <div className="h-2 rounded-full bg-white/25 mt-space-sm max-w-xs overflow-hidden">
              <div className="h-full w-[41%] rounded-full bg-white"></div>
            </div>
          </div>
          <button className="h-[46px] px-6 rounded-full bg-white text-primary text-[14px] font-bold shadow-sm hover:bg-surface-bright transition-colors">
            Top Up Balance
          </button>
        </section>

        {/* 2 Columns on Laptop: Menu (Left) and Transactions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Menu */}
          <section className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Today's Menu</h3>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Steamed Veggie Dimsums</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Lunch · 240 kcal</p>
                </div>
                <span className="text-[16px] font-extrabold text-primary">₹4.50</span>
              </div>
              <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Club Sandwich with Mint Dip</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Breakfast · 310 kcal</p>
                </div>
                <span className="text-[16px] font-extrabold text-primary">₹3.20</span>
              </div>
              <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Cold Pressed Orange Juice</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Beverage · 110 kcal</p>
                </div>
                <span className="text-[16px] font-extrabold text-primary">₹2.00</span>
              </div>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Transactions</h3>
            <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-on-surface">
                    Cold Brew Chocolate Milk + Fruit Bowl
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Today, 11:15 AM · Counter #1
                  </p>
                </div>
                <span className="text-[14px] font-bold text-on-surface">₹5.00</span>
              </div>
              <div className="h-px bg-surface-container"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-on-surface">
                    Whole Wheat Club Wrap + Fresh Juice
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Yesterday, 01:20 PM · Counter #2
                  </p>
                </div>
                <span className="text-[14px] font-bold text-on-surface">₹4.20</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
