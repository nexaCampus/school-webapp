'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import Toast from '@/components/Toast';
import { goApi } from '@/lib/api/go-client';
import type { CanteenWalletData } from '@/lib/api/go-types';

export default function CanteenPage() {
  const [wallet, setWallet] = useState<CanteenWalletData | null>(null);
  const [balance, setBalance] = useState<number>(42.5);
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    goApi.getCanteenWallet().then((data) => {
      setWallet(data);
      if (data?.balance != null) setBalance(data.balance);
    });
  }, []);

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

  const handleTopUpConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : topUpAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      setErrorMessage('Please enter a valid top-up amount greater than ₹0.');
      return;
    }
    if (finalAmount > 5000) {
      setErrorMessage('Maximum single top-up limit is ₹5,000 per institutional guideline.');
      return;
    }

    setBalance((prev) => prev + finalAmount);
    setIsTopUpOpen(false);
    setCustomAmount('');
    setErrorMessage(null);
    setToastMsg(`₹${finalAmount.toFixed(2)} credited successfully to Smart RFID Card!`);
  };

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
          <button
            onClick={() => {
              setErrorMessage(null);
              setIsTopUpOpen(true);
            }}
            className="h-[46px] px-6 rounded-full bg-white text-primary text-[14px] font-bold shadow-sm hover:bg-surface-bright transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_card</span>
            <span>Top Up Balance</span>
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

        {/* Top Up Modal */}
        {isTopUpOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Top Up Canteen Smart Card"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsTopUpOpen(false)}
          >
            <div
              className="w-full max-w-sm bg-white dark:bg-[#1a1c2b] rounded-3xl p-6 shadow-2xl border border-outline/15 dark:border-[#262a40] flex flex-col gap-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline/10 dark:border-[#262a40]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
                  <h3 className="text-lg font-bold text-on-surface">Top-Up Card Wallet</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-surface-container active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleTopUpConfirm} className="flex flex-col gap-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-error/10 text-error flex items-center gap-2 text-xs font-bold">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-on-surface mb-2 block">
                    Choose Preset Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setTopUpAmount(amt);
                          setCustomAmount('');
                          setErrorMessage(null);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          topUpAmount === amt && !customAmount
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-surface-container border-transparent text-on-surface hover:border-primary/30'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Or Enter Custom Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. 350"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container text-on-surface text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-outline/10">
                  <button
                    type="button"
                    onClick={() => setIsTopUpOpen(false)}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toastMsg && (
          <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />
        )}
      </div>
    </PortalShell>
  );
}
