'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function AcademicsPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Academics" activePath="academics">
      <div className="flex flex-col w-full relative">
        {/* Ambient Atmospheric Glowing Orbs */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-80 right-0 w-60 h-60 bg-secondary-container/15 rounded-full blur-2xl pointer-events-none -z-10"></div>

        {/* Student Context Bar */}
        <div className="pt-space-xs pb-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm bg-surface-container-high">
                <img
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEVqtgJy-5LRynRgcm6T10Ef-RLJ1-xFePqHI1zQ0RQN6LS-yrf8tUamFiRfDUkq9m7E9IVanpyNx86P2cquvw5KadeDhBJp1HryPVSaSvF7nnq4mosPgjYesvJv0GVPt9sDDc2SbOIJ6ZIZjJ5roJZnM5u0pZGGWqe3r86vvt0Unwc4lnvzAmMhOh6AwUuN3o53KG1SgjS75gOE6QhzCjQHWuYy1-hgFjiLmCCKBI9gEeQeaUORCsvob1nPn7X0_So6I"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-tertiary flex items-center justify-center ring-2 ring-white">
                <span className="material-symbols-outlined text-[9px] text-white font-bold">check</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Aarav Sharma</span>
              <span className="font-label-sm text-label-sm text-outline tracking-wider">
                GRADE 11-B • ROLL #24 • ACADEMIC HUB
              </span>
            </div>
          </div>
          <Link
            href="/timetable"
            aria-label="Academic Calendar"
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary shadow-sm transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </Link>
        </div>

        {/* Top Segmented Nav Pills (Scrollable) */}
        <div className="my-space-xs">
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1">
            <button className="px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap bg-primary text-on-primary shadow-[0_8px_20px_-4px_rgba(59,73,223,0.35)] transition-all">
              Overview
            </button>
            <Link
              href="/attendance"
              className="px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              Attendance
            </Link>
            <Link
              href="/exams"
              className="px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              Marks &amp; Cards
            </Link>
            <button className="px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-1">
              <span>Fee Payment</span>
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            </button>
          </div>
        </div>

        {/* Responsive 2-Column Feed on Laptop (lg:), single column on phone */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-space-md mt-space-xs">
          {/* Column 1: Financial & Ledger */}
          <div className="flex flex-col gap-space-md">
            {/* Fee Due Alert & Hero Card */}
            <div className="rounded-lg p-space-lg bg-gradient-to-br from-primary via-primary-container to-[#1a2399] text-on-primary shadow-[0_12px_32px_-6px_rgba(28,42,200,0.32)] relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
              <div className="absolute top-3 right-4 opacity-15">
                <span className="material-symbols-outlined text-[88px] text-white">
                  account_balance_wallet
                </span>
              </div>
              <div className="relative z-10 flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-on-primary">
                    <span className="material-symbols-outlined text-[15px] text-secondary-fixed">
                      error
                    </span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wide">
                      Term 2 Dues Pending
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-primary-fixed">Due: Oct 30, 2026</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <div className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed opacity-90">
                      Total Payable Amount
                    </div>
                    <div className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-on-primary tracking-tight">
                      ₹4,450
                      <span className="font-headline-sm text-headline-sm font-normal opacity-80">.00</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[24px] text-white">verified_user</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <button
                    className="flex-1 min-h-[46px] rounded-full bg-white text-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-95 transition-all hover:bg-surface-bright"
                    id="payNowBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>Pay Now • ₹4,450</span>
                  </button>
                  <button
                    aria-label="Fee details sheet"
                    className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-on-primary hover:bg-white/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 text-primary-fixed text-[11px] opacity-85">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">shield</span> 256-Bit SSL
                    Encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">auto_read_pause</span> Zero
                    Convenience Fee
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Fee Dues & Ledger Breakdown */}
            <div className="rounded-lg p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Fee Ledger &amp; Breakdown
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Semester II • Itemized structure
                  </span>
                </div>
                <button className="text-primary font-label-md text-label-md hover:underline">
                  Select All
                </button>
              </div>
              <div className="flex flex-col gap-space-xs">
                {/* Item 1 */}
                <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        Tuition Fee (Quarterly)
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        Mandatory Academic Instruction
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      ₹3,100
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        STEM Robotics Lab Fee
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        Material &amp; Equipment Maintenance
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      ₹250
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        Computer &amp; Digital Library
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        E-Portal License + Campus Wi-Fi
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      ₹400
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
                {/* Item 4 */}
                <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        Co-curricular &amp; Athletics
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        Inter-school Tournaments &amp; Arts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      ₹300
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Quick Document Actions */}
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary font-label-md text-label-md hover:bg-primary/15 transition-all">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Tax Receipt (80G)</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all">
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  <span>Payment History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Attendance, Performance & Showcase */}
          <div className="flex flex-col gap-space-md">
            {/* Monthly Attendance Metric Card */}
            <div className="rounded-lg p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Monthly Attendance
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    October 2026 • High Compliance
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                  <span className="font-label-sm text-label-sm uppercase">Eligible for Exams</span>
                </div>
              </div>
              <div className="flex items-center gap-space-lg pt-1">
                {/* Circular Progress Ring */}
                <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-container"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="9"
                    ></circle>
                    <circle
                      className="text-tertiary"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#006b49"
                      strokeDasharray="251.2"
                      strokeDashoffset="3.77"
                      strokeLinecap="round"
                      strokeWidth="9"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface leading-tight">
                      98.5%
                    </span>
                    <span className="font-label-sm text-[9px] uppercase tracking-wider text-outline font-semibold">
                      On Track
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-label-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span> Present
                    </span>
                    <span className="font-headline-sm text-body-md font-bold text-on-surface">
                      22 Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-label-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-error"></span> Absent
                    </span>
                    <span className="font-headline-sm text-body-md font-bold text-on-surface">
                      1 Day
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-label-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-tint"></span> Official Holiday
                    </span>
                    <span className="font-headline-sm text-body-md font-bold text-on-surface">
                      5 Days
                    </span>
                  </div>
                </div>
              </div>
              {/* Heat Map Preview */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-outline pb-1">
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                  <span>SUN</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center font-body-sm text-body-sm font-semibold text-on-surface">
                  <div className="h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">28</div>
                  <div className="h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">29</div>
                  <div className="h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">30</div>
                  <div className="h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">1</div>
                  <div className="h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">2</div>
                  <div className="h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">3</div>
                  <div className="h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">4</div>
                  <div className="h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">5</div>
                  <div className="h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">6</div>
                  <div className="h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">7</div>
                  <div className="h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">8</div>
                  <div className="h-7 rounded-lg bg-error-container text-error flex items-center justify-center font-bold">9</div>
                  <div className="h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">10</div>
                  <div className="h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">11</div>
                </div>
              </div>
            </div>

            {/* Term 1 Assessment & Performance Widget */}
            <div className="rounded-lg p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Term 1 Assessment
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Final Report Card Status
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">star</span>
                  <span>Grade A+</span>
                </div>
              </div>
              {/* Admit Card Ready Alert Banner */}
              <div className="rounded-xl p-space-md bg-surface-container-low flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                      Mid-Term Admit Card 2026
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Ready for Download
                    </span>
                  </div>
                </div>
                <Link
                  href="/exams"
                  className="px-3.5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  <span>Hall Ticket</span>
                </Link>
              </div>
              {/* Mini Subject Grade Highlights */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline truncate">Physics</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    96/100
                  </span>
                  <span className="font-label-sm text-[10px] text-tertiary font-bold">Top 2%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline truncate">Maths</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    98/100
                  </span>
                  <span className="font-label-sm text-[10px] text-tertiary font-bold">Top 1%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline truncate">Computer</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    99/100
                  </span>
                  <span className="font-label-sm text-[10px] text-tertiary font-bold">Subject Rank 1</span>
                </div>
              </div>
            </div>

            {/* Visual Showcase / Student Life Notice */}
            <div className="rounded-lg p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Upcoming Special Session
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                  Tomorrow
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                  <img
                    alt="Interactive Science Showcase"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHBIWddNhOp02Tz_sqQfGK_S-1I0JPQ-e1geLajWIVwoS47VF-VLbRiSE2zvzUqCCHV743vajbp_8RGmVFVZc2sUdEbR-iPu_CAyY4FKZ5NATDPKec_CNh2OC27jOM4wzVxmdyoeip4mkEBxShr2E9Om-FNfE0MrjAZLeizJElSaJB5oZYk2cGZq2h06h8H7zFMrzvOl_QGZy0pZYrvc0bkHt5a5-uRagCJvoHASJZ6QD_Z61OwHOqED-9zqT6xLW2QMA"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                    Advanced Robotics Exhibition
                  </span>
                  <span className="font-body-sm text-body-sm text-outline line-clamp-2">
                    Annual hardware presentation for Grade 11 STEM cohort at Newton Hall.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
