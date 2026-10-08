'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import { goApi } from '@/lib/goApiClient';
import type { CanteenWalletData } from '@/lib/goApiTypes';

export default function CanteenPage() {
  const [wallet, setWallet] = useState<CanteenWalletData | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    goApi.getCanteenWallet().then(setWallet);
  }, []);

  const balance = wallet?.balance ?? 42.5;
  const spentToday = wallet?.spentToday ?? 6.2;
  const limit = wallet?.dailyLimit ?? 15.0;
  const pct = Math.min(100, Math.round((spentToday / limit) * 100));

  const menu = wallet?.menu || [
    { id: 'c-1', name: 'Steamed Veggie Dimsums', mealCategory: 'Lunch', price: 4.5 },
    { id: 'c-2', name: 'Club Sandwich with Mint Dip', mealCategory: 'Breakfast', price: 3.2 },
    { id: 'c-3', name: 'Cold Pressed Orange Juice', mealCategory: 'Beverage', price: 2.0 },
  ];

  const transactions = wallet?.recentTransactions || [
    { id: 'tx-1', timestamp: 'Today, 11:15 AM', description: 'Cold Brew Chocolate Milk + Fruit Bowl', amount: 5.0 },
    { id: 'tx-2', timestamp: 'Yesterday, 01:20 PM', description: 'Whole Wheat Club Wrap + Fresh Orange Juice', amount: 4.2 },
  ];

  return (
    <PortalShell title="Canteen" activePath="canteen">
      <div className="flex flex-col gap-space-lg">
        {/* Wallet Hero Card */}
        <section className="bg-gradient-to-br from-primary to-primary-container rounded-lg p-space-lg text-white shadow-[0_12px_28px_-6px_rgba(28,42,200,0.35)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-label-sm text-label-sm font-bold tracking-widest opacity-80">
              SMART ID WALLET
            </p>
            <p className="font-display-lg-mobile text-display-lg-mobile mt-1 font-extrabold">₹{balance.toFixed(2)}</p>
            <p className="font-body-md text-body-md opacity-90 mt-0.5">
              Spent today ₹{spentToday.toFixed(2)} of ₹{limit.toFixed(2)} daily limit
            </p>
            <div className="h-2 rounded-full bg-white/25 mt-space-sm max-w-xs overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
          <button className="h-[46px] px-6 rounded-full bg-white text-primary text-[14px] font-bold shadow-sm hover:bg-surface-bright transition-colors cursor-pointer active:scale-95">
            Top Up Balance
          </button>
        </section>

        {/* 2 Columns on Laptop: Menu (Left) and Transactions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Menu */}
          <section className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Today's Menu</h3>
            <div className="flex flex-col gap-3">
              {menu.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest rounded-[18px] shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-[15px] font-bold text-on-surface">{item.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.mealCategory}</p>
                  </div>
                  <span className="text-[16px] font-extrabold text-primary">₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Transactions</h3>
            <div className="bg-surface-container-lowest rounded-[18px] shadow-sm p-5 flex flex-col gap-4">
              {transactions.map((t, idx) => (
                <div key={t.id}>
                  {idx > 0 && <div className="h-px bg-surface-container mb-4"></div>}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-on-surface">
                        {t.description}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {t.timestamp}
                      </p>
                    </div>
                    <span className="text-[14px] font-bold text-on-surface">₹{t.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
