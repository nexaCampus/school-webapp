import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import PortalFooter from '@/components/PortalFooter';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'Refund & Cancellation Policy | NexaCampus — Lions Calcutta Greater Vidya Mandir',
  description: 'Official school policy regarding fee refunds, store returns, canteen wallet settlements, and payment disputes.',
};

export default function RefundPolicyPage() {
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
            <span className="material-symbols-outlined text-sm">currency_exchange</span>
            <span>Billing &amp; Financial Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Refund, Cancellation &amp; Billing Policy
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Last Updated: October 12, 2026 • Academic Session 2026–2027
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            Governing Body: Lions Club of Calcutta Greater Education Trust • CISCE Affiliation No. 2430095
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-on-surface-variant">
          {/* Section 1: Transparency */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
              1. Transparent Pricing &amp; No Hidden Fees Commitment
            </h2>
            <p>
              Lions Calcutta Greater Vidya Mandir is committed to absolute billing transparency. All fee schedules, lab fees, examination registration fees, and optional campus logistics charges are published in advance in the official School Almanac.
            </p>
            <p>
              <strong>We do not charge hidden transaction fees, automated recurring card debits, or unexpected ancillary charges.</strong> Any payment gateway processing fee is transparently itemized prior to final payment authorization.
            </p>
          </section>

          {/* Section 2: Tuition & Admission Fees */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">school</span>
              2. Tuition, Admission &amp; Academic Fee Refunds
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Admission &amp; Registration Fee:</strong> One-time admission and registration fees are non-refundable once enrollment has been finalized and student UID allocated.</li>
              <li><strong>Quarterly Tuition Fee on Withdrawal:</strong> If a student formally withdraws before the commencement of an academic quarter, the tuition fee for that quarter is refundable upon submission of an official written application to the Principal. Once an academic term has commenced, tuition fees paid for the active quarter are non-refundable.</li>
              <li><strong>Caution Deposit / Security Deposit:</strong> Refundable security deposits are reimbursed in full (subject to clearance of library books, lab equipment, and sports gear) within 30 business days of Transfer Certificate (TC) processing.</li>
            </ul>
          </section>

          {/* Section 3: Failed Transactions */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">sync_problem</span>
              3. Payment Gateway Failures &amp; Double Debits
            </h2>
            <p>
              In the event that an amount is debited from a parent&apos;s bank account, UPI handle, or credit/debit card, but the portal transaction shows &quot;Failed&quot; or does not generate an official fee receipt:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The banking system automatically initiates an auto-reversal within <strong>5 to 7 banking business days</strong> back to the original payment source.</li>
              <li>If the duplicate deduction is not credited within 7 business days, parents should submit the bank transaction UTR reference via our{' '}
                <Link href="/helpdesk" className="text-primary font-bold hover:underline">
                  Parent Helpdesk
                </Link>{' '}
                under category &quot;Fee Payment Issue&quot; for instant finance department reconciliation.
              </li>
            </ul>
          </section>

          {/* Section 4: Campus Store */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">storefront</span>
              4. Campus Store (Uniforms, Books &amp; Stationery)
            </h2>
            <p>
              Merchandise ordered via the NexaCampus Campus Store:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Exchange Window:</strong> Unworn, unwashed uniform sets with original tags attached and undamaged text books may be exchanged for alternative sizing within <strong>7 days of collection</strong> at the physical campus store counter.</li>
              <li><strong>Defective Items:</strong> Any manufacturing defect in stationery or books will be replaced immediately with an identical item at zero additional cost.</li>
            </ul>
          </section>

          {/* Section 5: Canteen Wallet */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">wallet</span>
              5. Smart Canteen RFID Wallet Balance
            </h2>
            <p>
              Prepaid funds deposited into a student&apos;s Smart Canteen RFID wallet remain valid throughout the academic session. If a student leaves the school, any unutilized balance exceeding ₹50 is refunded to the parent&apos;s registered bank account upon TC clearance.
            </p>
          </section>

          {/* Section 6: Contact */}
          <section className="space-y-3 p-5 rounded-2xl bg-surface-container border border-outline/10">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">contact_support</span>
              6. Billing Dispute Contacts
            </h2>
            <p>
              For any payment queries, receipt verifications, or fee balance audits, please contact our accounts department:
            </p>
            <div className="text-xs space-y-1 font-mono text-on-surface">
              <p><strong>Accounts &amp; Finance Desk:</strong> Lions Calcutta Greater Vidya Mandir</p>
              <p><strong>Campus Address:</strong> Subhasgram, Kolkata, West Bengal — 700147</p>
              <p><strong>Email:</strong> <a href="mailto:accounts@lcgvm.edu.in" className="text-primary underline">accounts@lcgvm.edu.in</a> / <a href="mailto:office@lcgvm.edu.in" className="text-primary underline">office@lcgvm.edu.in</a></p>
              <p><strong>Phone:</strong> +91 33 2437 1234 (Ext. 204 — Accounts)</p>
            </div>
          </section>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
