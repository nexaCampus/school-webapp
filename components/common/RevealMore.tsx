'use client';

/**
 * NexaCampus Progressive Reveal Control
 *
 * Renders "Showing X of Y" plus a toggle that reveals the next batch of items.
 * Intended for long card lists that should not flood a phone viewport; the
 * caller decides which items are hidden below the `lg` breakpoint.
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
  primary: 'bg-[#1c2ac8] dark:bg-[#3b49df] hover:bg-[#2435df] shadow-[0_10px_24px_-8px_rgba(28,42,200,0.5)]',
  success: 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 shadow-[0_10px_24px_-8px_rgba(16,185,129,0.45)]',
} as const;

export function RevealMore({
  visible,
  total,
  onToggle,
  step = 4,
  tone = 'primary',
  noun = 'items',
}: RevealMoreProps) {
  if (total <= step) return null;

  const hasHidden = visible < total;
  const nextRevealCount = Math.min(step, total - visible);

  return (
    <div className="lg:hidden mt-6 flex flex-col items-center gap-2">
      <span className="text-[11px] font-semibold text-[#454655] dark:text-[#a0a4c0]">
        Showing {visible} of {total} {noun}
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!hasHidden}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-bold hover:active:scale-95 transition-all ${toneStyles[tone]}`}
      >
        <span>{hasHidden ? `Show ${nextRevealCount} more` : 'Collapse'}</span>
        <span
          className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
            hasHidden ? '' : 'rotate-180'
          }`}
        >
          keyboard_arrow_down
        </span>
      </button>
    </div>
  );
}

export default RevealMore;
