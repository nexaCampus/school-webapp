'use client';

/**
 * NexaCampus Modular Button Component
 */

import React, { type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'surface' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-sm hover:opacity-90 active:scale-[0.98] border border-transparent',
  secondary:
    'bg-secondary text-on-secondary shadow-sm hover:opacity-90 active:scale-[0.98] border border-transparent',
  surface:
    'bg-surface-container-high dark:bg-[#222538] text-on-surface hover:bg-surface-container-highest active:scale-[0.98] border border-outline/10 dark:border-[#222538]',
  danger:
    'bg-error text-white shadow-sm hover:bg-error/90 active:scale-[0.98] border border-transparent',
  ghost:
    'bg-transparent text-on-surface hover:bg-surface-container/60 active:scale-[0.98] border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-[11.5px] px-3 py-1.5 rounded-full',
  md: 'text-[13px] px-4 py-2 rounded-full',
  lg: 'text-[14px] px-5 py-2.5 rounded-full',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[17px]">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
