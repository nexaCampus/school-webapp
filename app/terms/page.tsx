import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import PortalFooter from '@/components/PortalFooter';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'Terms of Service | NexaCampus — Lions Calcutta Greater Vidya Mandir',
  description: 'Institutional Terms of Service governing access, portal rules, user conduct, and academic responsibilities.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoEmblem className="h-9 w-9 shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] tracking-tight group-hover:text-primary transition-colors">
                Lions Calcutta Greater Vidya Mandir
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                NexaCampus Institutional Portal
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              href="/"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Legal Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="mb-8 pb-6 border-b border-outline/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">gavel</span>
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Service &amp; Code of Conduct
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Last Updated: October 12, 2026 • Effective Academic Session 2026–2027
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            Governing Institution: Lions Calcutta Greater Vidya Mandir (LCGVM), Subhasgram, Kolkata — 700147
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-on-surface-variant">
          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering on, or utilizing the NexaCampus web application and institutional services, you agree to be bound by these Terms of Service, our{' '}
              <Link href="/privacy" className="text-primary font-bold hover:underline">
                Privacy Policy
              </Link>, and the official School Almanac. If you do not accept these terms, you must refrain from using the platform.
            </p>
          </section>

          {/* Section 2: User Accounts */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
              2. User Accounts &amp; Security
            </h2>
            <p>
              Access to student records, report cards, fee payments, and attendance is strictly restricted to enrolled students, verified parents/guardians, and authorized faculty members:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Credential Confidentiality:</strong> Users are solely responsible for maintaining the confidentiality of their admission numbers, Google credentials, and passwords.</li>
              <li><strong>Prohibition of Sharing:</strong> Student admission credentials must never be shared with unauthorized third parties or commercial coaching entities.</li>
              <li><strong>Unauthorized Access:</strong> Any attempt to probe, bypass authentication tokens, alter attendance logs, or access other students&apos; data constitutes an offense under Section 66 of the Information Technology Act, 2000, and is subject to immediate disciplinary suspension.</li>
            </ul>
          </section>

          {/* Section 3: Academic Integrity */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
              3. Academic Integrity &amp; CISCE Regulations
            </h2>
            <p>
              The platform facilitates academic tracking under CISCE (Council for the Indian School Certificate Examinations) guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Attendance Compliance:</strong> As per CISCE regulations, students are required to maintain a minimum of 75% attendance to qualify for ICSE / ISC board examinations. Attendance recorded via school biometric / RFID terminals is authoritative.</li>
              <li><strong>Homework &amp; Project Submissions:</strong> Plagiarism or submitting uncredited AI-generated work in school assignments is strictly prohibited.</li>
            </ul>
          </section>

          {/* Section 4: Fees and Transactions */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">payments</span>
              4. Tuition Fees, Billing &amp; Digital Payments
            </h2>
            <p>
              All school fee transactions processed through the platform are governed by the school fee schedule:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Payment Gateway:</strong> Digital fee payments are powered by PCI-DSS compliant gateways (Razorpay). Digital receipts generated on the portal serve as valid financial acknowledgments.</li>
              <li><strong>Timely Payment:</strong> Quarterly tuition fees must be cleared by the 15th of the corresponding quarter month to prevent late fees as specified in the School Almanac.</li>
              <li><strong>Refund Terms:</strong> Fee disputes and cancellation terms are governed strictly by our{' '}
                <Link href="/refund" className="text-primary font-bold hover:underline">
                  Refund &amp; Cancellation Policy
                </Link>.
              </li>
            </ul>
          </section>

          {/* Section 5: Campus Services */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">directions_bus</span>
              5. Smart Logistics, Canteen RFID &amp; GPS Radar
            </h2>
            <p>
              Bus GPS telemetry and Canteen RFID balances are provided as institutional conveniences:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>GPS Telemetry:</strong> While school buses transmit live GPS data, minor telemetry delays may occur due to cellular tower handoffs or traffic bottlenecks. Guardians should exercise reasonable discretion regarding arrival timings.</li>
              <li><strong>Canteen Wallets:</strong> Cafeteria funds are non-transferable between unrelated students and are restricted to campus dining counters.</li>
            </ul>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">warning</span>
              6. Limitation of Liability
            </h2>
            <p>
              The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While the School implements redundant cloud architecture and in-memory L1 caching to maximize uptime (&gt;99.9%), the School shall not be held liable for temporary interruptions caused by telecommunication outages, scheduled maintenance, or acts of God.
            </p>
          </section>

          {/* Section 7: Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">balance</span>
              7. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms of Service are governed by and construed under the laws of the Republic of India. Any legal dispute, arbitration, or proceeding arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.
            </p>
          </section>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
