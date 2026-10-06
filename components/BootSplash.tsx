'use client';

// Boot overlay: the first full document load on any route except / shows the
// splash before the page underneath mounts. Client-side navigation never
// triggers it (module flag survives), so in-app routing stays instant.
// Pages underneath mount only after the overlay lifts, which also keeps the
// OAuth return trip safe: its completion effect simply runs a moment later.
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isBooted, markBooted } from '@/lib/boot';
import SplashView from './SplashView';

const DURATION_MS = 2600;

function labelFor(pct: number): string {
  if (pct < 40) return 'Initializing secure portal...';
  if (pct < 70) return 'Syncing academic timetable...';
  if (pct < 90) return 'Decrypting attendance logs...';
  if (pct < 100) return 'Readying dashboard experience...';
  return 'Welcome to Lions Portal';
}

export default function BootSplash({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (isBooted() || pathname === '/') {
      markBooted();
      return;
    }
    setShow(true);
    const started = Date.now();
    const id = setInterval(() => {
      const p = Math.min(100, Math.floor(((Date.now() - started) / DURATION_MS) * 100));
      setPct(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => {
          markBooted();
          setShow(false);
        }, 250);
      }
    }, 50);
    return () => clearInterval(id);
  }, [pathname]);

  if (!show) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] bg-surface overflow-y-auto">
      <SplashView pct={pct} label={labelFor(pct)} />
    </div>
  );
}
