'use client';

/**
 * NexaCampus Modular Modal Component
 *
 * An accessible, keyboard-interactive, animated dialog container.
 * Matches the Obsidian Midnight palette with backdrop blur.
 */

import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm?: () => void | Promise<void>;
  isBusy?: boolean;
  busyText?: string;
  children?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  confirmText,
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  isBusy = false,
  busyText = 'Processing...',
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isBusy) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isBusy, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBusy) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#151622] border border-outline/15 dark:border-[#222538] p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        {icon && (
          <div className={`w-14 h-14 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-4 shadow-sm`}>
            <span className="material-symbols-outlined text-[28px]">{icon}</span>
          </div>
        )}

        <h3 id="modal-title" className="text-[17px] font-bold text-on-surface">
          {title}
        </h3>

        {description && (
          <p className="text-[12px] text-on-surface-variant mt-2 leading-relaxed">
            {description}
          </p>
        )}

        {children && <div className="w-full mt-4">{children}</div>}

        {(onConfirm || cancelText) && (
          <div className="flex flex-col gap-2 w-full mt-6">
            {onConfirm && (
              <button
                type="button"
                disabled={isBusy}
                onClick={onConfirm}
                className={`w-full py-2.5 rounded-full text-white text-[13px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                  confirmVariant === 'danger'
                    ? 'bg-error hover:bg-error/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isBusy ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    <span>{busyText}</span>
                  </>
                ) : (
                  <span>{confirmText || 'Confirm'}</span>
                )}
              </button>
            )}

            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-surface-container-high dark:bg-[#222538] text-on-surface text-[13px] font-semibold hover:bg-surface-container-highest active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
