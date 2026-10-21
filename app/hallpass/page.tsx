'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import Toast from '@/components/Toast';

export default function HallPassPage() {
  const [secondsLeft, setSecondsLeft] = useState<number>(761); // 12m 41s
  const [isPassActive, setIsPassActive] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  useEffect(() => {
    if (!isPassActive || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsPassActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPassActive, secondsLeft]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndPassEarly = () => {
    setIsPassActive(false);
    setSecondsLeft(0);
    setToastMsg('Corridor pass checked in & ended early. Recorded at Proctor Master Gate.');
  };

  return (
    <PortalShell title="Hall Pass" activePath="hallpass">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-space-md">
        {/* Active Pass Digital Card */}
        <section
          className={`w-full rounded-[22px] p-space-lg text-white shadow-xl relative overflow-hidden transition-all ${
            isPassActive
              ? 'bg-gradient-to-br from-tertiary to-[#006B49] shadow-[0_16px_32px_-8px_rgba(0,80,54,0.5)]'
              : 'bg-gradient-to-br from-slate-600 to-slate-800 shadow-[0_16px_32px_-8px_rgba(15,23,42,0.4)]'
          }`}
        >
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-widest bg-white/20 rounded-full px-2.5 py-1">
              {isPassActive ? 'PASS-9042 · ACTIVE' : 'PASS-9042 · EXPIRED / CHECKED IN'}
            </span>
            <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
          </div>
          <p className="font-display-lg-mobile text-display-lg-mobile mt-space-sm font-extrabold font-mono">
            {formatCountdown(secondsLeft)}
          </p>
          <p className="font-body-md text-body-md opacity-90">
            {isPassActive ? 'remaining of 15 minutes' : 'Pass session completed'}
          </p>
          <div className="h-2 rounded-full bg-white/25 mt-space-sm overflow-hidden">
            <div
              className={`h-full rounded-full bg-white dark:bg-[#151622] ${isPassActive ? 'animate-pulse' : ''}`}
              style={{ width: `${Math.round((secondsLeft / 900) * 100)}%` }}
            ></div>
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
          {isPassActive ? (
            <button
              onClick={handleEndPassEarly}
              className="flex-1 h-[48px] rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-white active:scale-95 transition-all text-[14px] font-bold shadow-sm cursor-pointer"
            >
              End Pass Early
            </button>
          ) : (
            <button
              onClick={() => {
                setIsPassActive(true);
                setSecondsLeft(900);
                setToastMsg('New corridor pass request submitted to Class Faculty.');
              }}
              className="flex-1 h-[48px] rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all text-[14px] font-bold shadow-sm cursor-pointer"
            >
              Request New Pass
            </button>
          )}
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

        {toastMsg && (
          <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />
        )}
      </div>
    </PortalShell>
  );
}
