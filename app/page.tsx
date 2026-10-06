'use client';

// Splash route: staged loader mirroring Android SplashScreen.
// If the student has an active session (within 2-week inactivity window),
// smoothly routes straight to /home. Otherwise, transitions to /chooser.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashView from '@/components/SplashView';
import { getSession } from '@/lib/session';

const STAGES = [
  { pct: 64, label: 'Initializing secure portal...' },
  { pct: 72, label: 'Syncing academic timetable...' },
  { pct: 89, label: 'Decrypting attendance logs...' },
  { pct: 98, label: 'Readying dashboard experience...' },
  { pct: 100, label: 'Welcome to Lions Portal' },
];

const WAITS = [80, 80, 80, 80, 80];

export default function SplashPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  const routeDestination = () => {
    const s = getSession();
    if (s?.student || s?.name) {
      router.replace('/home');
    } else {
      router.replace('/chooser');
    }
  };

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const advance = (i: number) => {
      if (cancelled) return;
      if (i >= STAGES.length) {
        timer = setTimeout(() => {
          if (!cancelled) {
            routeDestination();
          }
        }, WAITS[WAITS.length - 1]);
        return;
      }
      setStage(i);
      timer = setTimeout(() => advance(i + 1), WAITS[i]);
    };
    advance(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router]);

  const current = STAGES[Math.min(stage, STAGES.length - 1)];

  return (
    <SplashView pct={current.pct} label={current.label} onClick={routeDestination} />
  );
}
