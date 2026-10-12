'use client';

/**
 * NexaCampus Global & Component-Level Error Boundary
 * Gracefully traps render-phase exceptions and renders an Obsidian Midnight recovery card.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render-phase error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest dark:bg-[#151622] border border-outline/10 dark:border-[#222538] rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>

            <h2 className="text-[18px] font-bold text-on-surface">Something went wrong</h2>
            <p className="text-[12px] text-on-surface-variant mt-1.5 leading-relaxed">
              An unexpected error occurred while loading this section of the portal.
            </p>

            {this.state.error?.message && (
              <div className="w-full bg-surface-container dark:bg-[#101119] rounded-xl p-3 my-4 text-[11px] font-mono text-outline truncate">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 rounded-full bg-primary text-white text-[13px] font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Try Again
              </button>
              <Link
                href="/home"
                className="flex-1 py-2.5 rounded-full bg-surface-container-high dark:bg-[#222538] text-on-surface text-[13px] font-semibold hover:bg-surface-container-highest active:scale-95 transition-all text-center"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
