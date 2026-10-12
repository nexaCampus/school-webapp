'use client';

/**
 * NexaCampus Modular Badge Component
 */

import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'outline' | 'neutral';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary dark:text-[#bdc2ff] border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  error: 'bg-error/10 text-error border-error/20',
  outline: 'bg-transparent text-on-surface-variant border-outline/20 dark:border-[#222538]',
  neutral: 'bg-surface-container dark:bg-[#1a1c2b] text-on-surface-variant border-outline/10 dark:border-[#222538]',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const sizeCls = size === 'sm' ? 'text-[9.5px] px-2 py-0.5' : 'text-[11px] px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border tracking-tight ${sizeCls} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[13px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
