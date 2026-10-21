'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import Toast from '@/components/Toast';

interface Club {
  name: string;
  desc: string;
  icon: string;
  accentBg: string;
  accentColor: string;
  enrolled: boolean;
}

const INITIAL_CLUBS: Club[] = [
  {
    name: 'Robotics Club',
    desc: '42 members · Active Labs & Automation',
    icon: 'smart_toy',
    accentBg: 'bg-primary/10',
    accentColor: 'text-primary',
    enrolled: true,
  },
  {
    name: 'Debate Society',
    desc: '35 members · Parliamentary & MUN',
    icon: 'forum',
    accentBg: 'bg-secondary/10',
    accentColor: 'text-secondary dark:text-[#ffb95f]',
    enrolled: true,
  },
  {
    name: 'Astronomy Club',
    desc: '28 members · Night Sky Observations',
    icon: 'travel_explore',
    accentBg: 'bg-primary-fixed',
    accentColor: 'text-primary',
    enrolled: false,
  },
  {
    name: 'Literary & Editorial Club',
    desc: '31 members · School Magazine & Essays',
    icon: 'edit_note',
    accentBg: 'bg-tertiary/10',
    accentColor: 'text-tertiary',
    enrolled: false,
  },
  {
    name: 'Music & Choir Ensemble',
    desc: '50 members · Annual Fest Performance',
    icon: 'music_note',
    accentBg: 'bg-secondary-container/20',
    accentColor: 'text-secondary dark:text-[#ffb95f]',
    enrolled: false,
  },
  {
    name: 'Eco & Sustainability Corps',
    desc: '26 members · Campus Solar & Green Projects',
    icon: 'eco',
    accentBg: 'bg-tertiary-fixed/40',
    accentColor: 'text-tertiary',
    enrolled: false,
  },
];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  const handleJoinClub = (clubName: string) => {
    setClubs((prev) =>
      prev.map((c) => (c.name === clubName ? { ...c, enrolled: true } : c))
    );
    setToastMsg(`Successfully joined ${clubName}! Orientation notice sent to Diary.`);
  };

  const enrolledCount = clubs.filter((c) => c.enrolled).length;

  return (
    <PortalShell title="Clubs & Activities" activePath="clubs">
      <div className="flex flex-col gap-space-md">
        {/* Status Alert Banner */}
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-[16px] px-4 py-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[20px]">groups</span>
          <p className="text-[13px] font-bold text-tertiary">
            Enrolled in {enrolledCount} club{enrolledCount === 1 ? '' : 's'} · 3 interschool competitions open for registration
          </p>
        </div>

        {/* Responsive Clubs Grid: 1 col on phone, 2 on tablet, 3 on laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-space-xs">
          {clubs.map((c, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`w-12 h-12 rounded-[14px] ${c.accentBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`material-symbols-outlined ${c.accentColor} text-[24px]`}>
                    {c.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-on-surface truncate">{c.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{c.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Club Chapter
                </span>
                {c.enrolled ? (
                  <span className="text-[11px] font-bold text-tertiary bg-tertiary/10 rounded-full px-3 py-1">
                    Joined
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoinClub(c.name)}
                    className="text-[12px] font-bold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all rounded-full px-4 py-1 shadow-sm cursor-pointer"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {toastMsg && (
          <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />
        )}
      </div>
    </PortalShell>
  );
}
