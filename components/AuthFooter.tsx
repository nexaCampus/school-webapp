import Link from 'next/link';
import LogoEmblem from './LogoEmblem';

export default function AuthFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`w-full border-t border-outline/10 bg-surface/80 backdrop-blur-md py-6 mt-auto relative z-20 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* School Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" title="NexaCampus Home" className="flex-shrink-0 flex items-center">
            <LogoEmblem className="h-8 w-8" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="text-[13px] font-bold text-on-surface">
                Lions Calcutta Greater Vidya Mandir
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                CISCE Affiliated
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant">
              Affiliation No. 2430095 • School Code: 15632 • Kolkata, WB
            </span>
          </div>
        </div>

        {/* Security & Support Info */}
        <div className="flex flex-col sm:items-end items-center gap-1 text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span className="inline-flex items-center gap-1 text-outline">
              <span className="material-symbols-outlined text-[13px] text-tertiary">lock</span>
              256-Bit SSL
            </span>
            <span className="text-outline">•</span>
            <a
              href="tel:+913324371234"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[13px]">support_agent</span>
              <span>Admin Office: +91 33 2437 1234</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-outline text-[10px] flex-wrap justify-center sm:justify-end">
            <span>© {new Date().getFullYear()} LCGVM</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
              Refunds
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
              Cookies
            </Link>
            <span>•</span>
            <Link href="/data-deletion" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
              Data Deletion
            </Link>
            <span>•</span>
            <span>Powered by NexaCampus v2.5.3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
