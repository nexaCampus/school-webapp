'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import PortalFooter from '@/components/PortalFooter';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useTenant } from '@/lib/context/TenantContext';

export default function CookiePolicyPage() {
  const { tenant, isPlatformRoot } = useTenant();
  const schoolName = tenant?.school_name || 'Lions Calcutta Greater Vidya Mandir';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Cookie Policy | ${schoolName}`;
    }
  }, [schoolName]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoEmblem className="h-9 w-9 shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] tracking-tight group-hover:text-primary transition-colors">
                {isPlatformRoot ? 'NexaCampus Cloud' : schoolName}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {isPlatformRoot ? 'Enterprise Operating System' : `${tenant?.affiliation_board || 'CISCE'} Institutional Portal`}
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
            <span className="material-symbols-outlined text-sm">cookie</span>
            <span>Cookie &amp; Storage Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Institutional Cookie &amp; Storage Policy
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Last Updated: October 12, 2026 • Academic Session 2026–2027
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-on-surface-variant">
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              1. What Are Cookies &amp; Storage Tokens?
            </h2>
            <p>
              Cookies and browser local storage are small text files or key-value entries stored on your device by web applications. On the NexaCampus institutional portal, we use these technologies strictly to authenticate authorized parents and students, protect session integrity against forgery, and remember accessibility preferences like Dark Mode.
            </p>
            <p className="font-semibold text-on-surface">
              We never use advertising cookies, third-party remarketing pixels, or cross-site tracking beacons.
            </p>
          </section>

          {/* Section 2: Cookie Inventory Table */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">table_chart</span>
              2. Complete Inventory of Cookies &amp; Local Storage Used
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-outline/10 bg-surface-container-lowest">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface font-bold uppercase border-b border-outline/10">
                  <tr>
                    <th className="py-3 px-4">Identifier / Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/10 font-mono text-[11px]">
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">school_session_active</td>
                    <td className="py-3 px-4">Strictly Necessary</td>
                    <td className="py-3 px-4">14 Days</td>
                    <td className="py-3 px-4 font-sans">Signals an active authenticated student or guardian session to render dashboard routes.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">school_auth_token</td>
                    <td className="py-3 px-4">Strictly Necessary (HttpOnly)</td>
                    <td className="py-3 px-4">Session / 14 Days</td>
                    <td className="py-3 px-4 font-sans">Cryptographically signed JWT authorizing API requests to the Go backend. Protected from script inspection.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">_csrf</td>
                    <td className="py-3 px-4">Strictly Necessary</td>
                    <td className="py-3 px-4">Session</td>
                    <td className="py-3 px-4 font-sans">Cross-Site Request Forgery guard protecting fee payments, homework submissions, and profile changes.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">theme</td>
                    <td className="py-3 px-4">Functional (LocalStorage)</td>
                    <td className="py-3 px-4">Persistent</td>
                    <td className="py-3 px-4 font-sans">Stores user UI theme preference (Dark Mode vs Light Mode) to prevent screen flickering on page load.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">cookie_consent</td>
                    <td className="py-3 px-4">Functional (LocalStorage)</td>
                    <td className="py-3 px-4">1 Year</td>
                    <td className="py-3 px-4 font-sans">Remembers your cookie consent choice (&quot;all&quot; or &quot;essential&quot;) so you are not prompted repeatedly.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Cookie Categories */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">category</span>
              3. Categories of Technologies Used
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container border border-outline/10">
                <h3 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  Strictly Necessary (Always Active)
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Essential for portal navigation, logging into your child&apos;s academic dashboard, paying fees, and safeguarding accounts against forgery. Without these, the application cannot function securely.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline/10">
                <h3 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-primary text-base">palette</span>
                  Functional &amp; Performance
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Used exclusively to store display settings (such as dark mode) and client-side micro-caches (TinyLFU) so timetable and circular pages load in &lt;1ms without redundant data usage.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: How to Control Cookies */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">tune</span>
              4. How to Manage or Disable Cookies
            </h2>
            <p>
              You can adjust your browser settings at any time to block or delete cookies:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</li>
              <li><strong>Apple Safari:</strong> Preferences → Privacy → Block all cookies.</li>
              <li><strong>Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Enhanced Tracking Protection.</li>
            </ul>
            <p className="text-xs text-on-surface-variant mt-2">
              <em>Note:</em> Disabling strictly necessary session cookies will prevent you from signing in to the student portal and accessing report cards.
            </p>
          </section>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
