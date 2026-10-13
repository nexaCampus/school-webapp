'use client';

/**
 * NexaCampus Progressive Reveal Control
 *
 * Renders "Showing X of Y" plus an intuitive down arrow button that reveals
 * the next batch of 4 items on phone viewports.
 * On laptop viewports (lg:), all items are always visible and this control is hidden.
 */

import React from 'react';

export interface RevealMoreProps {
  visible: number;
  total: number;
  onToggle: () => void;
  step?: number;
  tone?: 'primary' | 'success';
  noun?: string;
}

const toneStyles = {
  primary: {
    btn: 'bg-white dark:bg-[#1a1c2b] border-2 border-[#1c2ac8]/30 dark:border-[#3b49df]/40 hover:border-[#1c2ac8] dark:hover:border-[#3b49df] text-[#1c2ac8] dark:text-[#bdc2ff] shadow-md shadow-[#1c2ac8]/10 hover:shadow-lg hover:shadow-[#1c2ac8]/20',
    iconCircle: 'bg-[#1c2ac8]/10 dark:bg-[#3b49df]/20 text-[#1c2ac8] dark:text-[#bdc2ff] group-hover:bg-[#1c2ac8] group-hover:text-white dark:group-hover:bg-[#3b49df]',
  },
  success: {
    btn: 'bg-white dark:bg-[#141520] border-2 border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10 hover:shadow-lg',
    iconCircle: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
  },
} as const;

export function RevealMore({
  visible,
  total,
  onToggle,
  step = 4,
  tone = 'primary',
  noun = 'micro modules',
}: RevealMoreProps) {
  if (total <= step) return null;

  const hasHidden = visible < total;
  const nextRevealCount = Math.min(step, total - visible);
  const styles = toneStyles[tone];

  return (
    <div className="lg:hidden mt-8 flex flex-col items-center justify-center gap-2.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!hasHidden}
        aria-label={hasHidden ? `Show next ${nextRevealCount} ${noun}` : `Collapse ${noun}`}
        className={`group inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs font-extrabold active:scale-95 transition-all cursor-pointer select-none ${styles.btn}`}
      >
        <span>
          {hasHidden ? `Show ${nextRevealCount} More (${visible}/${total})` : `Show Fewer ${noun}`}
        </span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${styles.iconCircle}`}>
          <span
            className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
              hasHidden ? 'animate-bounce group-hover:animate-none' : 'rotate-180'
            }`}
          >
            keyboard_arrow_down
          </span>
        </span>
      </button>

      {hasHidden ? (
        <span className="text-[11px] font-semibold text-[#454655] dark:text-[#a0a4c0] flex items-center gap-1">
          <span>Tap arrow to reveal 4 more {noun}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
        </span>
      ) : (
        <span className="text-[11px] font-semibold text-[#454655] dark:text-[#a0a4c0]">
          All {total} {noun} displayed
        </span>
      )}
    </div>
  );
}

export default RevealMore;
