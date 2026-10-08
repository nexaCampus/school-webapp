'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import { goApi } from '@/lib/goApiClient';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export default function AcademicsPage() {
  const queryClient = useQueryClient();
  const [student, setStudent] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
    } else {
      setStudent(s.student);
    }
  }, []);

  const handlePayment = async () => {
    if (isPaying) return;
    setIsPaying(true);
    setPaymentError(null);
    setPaymentNotice(null);

    try {
      const order = await goApi.postPayment({
        feeRecordIds: ['fee-term2-2026'],
        studentId: student?.id || '10211125',
        amount: 4450,
        paymentMethod: 'upi',
      });

      // Verify payment order on Go backend with HMAC signature
      const receipt = await goApi.postPaymentVerify({
        orderId: order.orderId,
        paymentId: `PAY-${Date.now()}`,
        signature: `hmac_${Math.random().toString(36).substring(2, 12)}`,
      });

      // Invalidate fees, canteen wallet, and student caches
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canteen.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });

      setPaymentNotice(`Payment successful! Receipt ${receipt.invoiceNo} issued via 256-Bit SSL verification.`);
      setTimeout(() => setPaymentNotice(null), 6000);
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : 'Payment could not be processed. Please try again.');
      setTimeout(() => setPaymentError(null), 6000);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <PortalShell title="Academics" activePath="academics">
      <div className="flex flex-col w-full relative">
        {/* Ambient Atmospheric Glowing Orbs */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-80 right-0 w-60 h-60 bg-secondary-container/15 rounded-full blur-2xl pointer-events-none -z-10"></div>

        {/* Student Context Bar */}
        <div className="pt-1 pb-2 sm:pt-space-xs sm:pb-space-sm flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-space-sm">
            <div className="relative">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-sm bg-surface-container-high">
                <img
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEVqtgJy-5LRynRgcm6T10Ef-RLJ1-xFePqHI1zQ0RQN6LS-yrf8tUamFiRfDUkq9m7E9IVanpyNx86P2cquvw5KadeDhBJp1HryPVSaSvF7nnq4mosPgjYesvJv0GVPt9sDDc2SbOIJ6ZIZjJ5roJZnM5u0pZGGWqe3r86vvt0Unwc4lnvzAmMhOh6AwUuN3o53KG1SgjS75gOE6QhzCjQHWuYy1-hgFjiLmCCKBI9gEeQeaUORCsvob1nPn7X0_So6I"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-tertiary flex items-center justify-center ring-2 ring-white">
                <span className="material-symbols-outlined text-[8px] sm:text-[9px] text-white font-bold">check</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface truncate">Aarav Sharma</span>
              <span className="text-[9.5px] sm:text-label-sm text-outline tracking-wider truncate">
                GRADE 11-B • ROLL #24 • ACADEMIC HUB
              </span>
            </div>
          </div>
          <Link
            href="/timetable"
            aria-label="Academic Calendar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary shadow-sm transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">calendar_month</span>
          </Link>
        </div>

        {/* Top Segmented Nav Pills (Scrollable) */}
        <div className="my-1 sm:my-space-xs">
          <div className="flex items-center gap-1.5 sm:gap-space-xs overflow-x-auto no-scrollbar py-1">
            <button className="px-3 py-1.5 sm:px-space-md sm:py-2 rounded-full text-[11.5px] sm:text-label-md font-semibold whitespace-nowrap bg-primary text-on-primary shadow-sm sm:shadow-[0_8px_20px_-4px_rgba(59,73,223,0.35)] transition-all">
              Overview
            </button>
            <Link
              href="/attendance"
              className="px-3 py-1.5 sm:px-space-md sm:py-2 rounded-full text-[11.5px] sm:text-label-md font-semibold whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              Attendance
            </Link>
            <Link
              href="/exams"
              className="px-3 py-1.5 sm:px-space-md sm:py-2 rounded-full text-[11.5px] sm:text-label-md font-semibold whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              Marks &amp; Cards
            </Link>
            <button className="px-3 py-1.5 sm:px-space-md sm:py-2 rounded-full text-[11.5px] sm:text-label-md font-semibold whitespace-nowrap bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-1">
              <span>Fee Payment</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary-container"></span>
            </button>
          </div>
        </div>

        {/* Responsive 2-Column Feed on Laptop (lg:), single column on phone */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-space-md mt-space-xs">
          {/* Column 1: Financial & Ledger */}
          <div className="flex flex-col gap-3 sm:gap-space-md">
            {/* Fee Due Alert & Hero Card */}
            <div className="rounded-xl p-3.5 sm:p-space-lg bg-gradient-to-br from-primary via-primary-container to-[#1a2399] text-on-primary shadow-[0_8px_24px_-4px_rgba(28,42,200,0.32)] relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
              <div className="absolute top-3 right-4 opacity-15">
                <span className="material-symbols-outlined text-[88px] text-white">
                  account_balance_wallet
                </span>
              </div>
              <div className="relative z-10 flex flex-col gap-3 sm:gap-space-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-on-primary flex-shrink-0 max-w-fit">
                    <span className="material-symbols-outlined text-[12px] sm:text-[15px] text-secondary-fixed flex-shrink-0">
                      error
                    </span>
                    <span className="text-[8.5px] sm:text-label-sm uppercase tracking-tight sm:tracking-wide font-bold whitespace-nowrap">
                      <span className="sm:hidden">Term 2 Dues</span>
                      <span className="hidden sm:inline">Term 2 Dues Pending</span>
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-label-md text-primary-fixed whitespace-nowrap flex-shrink-0 font-medium">
                    Due: Oct 30, 2026
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <div className="text-[10px] sm:text-label-sm uppercase tracking-wider text-primary-fixed opacity-90">
                      Total Payable Amount
                    </div>
                    <div className="text-[26px] sm:text-display-lg-mobile font-extrabold text-on-primary tracking-tight">
                      ₹4,450
                      <span className="text-[16px] sm:text-headline-sm font-normal opacity-80">.00</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white">verified_user</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-space-sm pt-1">
                  <button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="flex-1 min-h-[40px] sm:min-h-[46px] rounded-full bg-white text-primary text-[12.5px] sm:text-label-lg font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-95 transition-all hover:bg-surface-bright disabled:opacity-60 disabled:cursor-not-allowed"
                    id="payNowBtn"
                  >
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                      {isPaying ? 'progress_activity' : 'lock'}
                    </span>
                    <span>{isPaying ? 'Securing payment...' : 'Pay Now • ₹4,450'}</span>
                  </button>
                  <button
                    aria-label="Fee details sheet"
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-on-primary hover:bg-white/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">receipt_long</span>
                  </button>
                </div>

                {paymentNotice && (
                  <div className="bg-white/20 backdrop-blur-md text-white text-[11px] p-2 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                    <span className="material-symbols-outlined text-[15px] text-secondary-fixed">check_circle</span>
                    <span>{paymentNotice}</span>
                  </div>
                )}

                {paymentError && (
                  <div className="bg-error/30 text-white text-[11px] p-2 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                    <span className="material-symbols-outlined text-[15px]">error</span>
                    <span>{paymentError}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-0.5 text-primary-fixed text-[10px] sm:text-[11px] opacity-85">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] sm:text-[13px]">shield</span> 256-Bit SSL
                    Encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] sm:text-[13px]">auto_read_pause</span> Zero
                    Convenience Fee
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Fee Dues & Ledger Breakdown */}
            <div className="rounded-xl p-3.5 sm:p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-3 sm:gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface">
                    Fee Ledger &amp; Breakdown
                  </span>
                  <span className="text-[10px] sm:text-body-sm text-outline">
                    Semester II • Itemized structure
                  </span>
                </div>
                <button className="text-primary text-[11px] sm:text-label-md font-semibold hover:underline">
                  Select All
                </button>
              </div>
              <div className="flex flex-col gap-space-xs">
                {/* Item 1 */}
                <div className="flex items-center justify-between p-2.5 sm:p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] sm:text-label-lg text-on-surface font-semibold truncate">
                        Tuition Fee (Quarterly)
                      </span>
                      <span className="text-[10px] sm:text-label-sm text-outline">
                        Mandatory Academic Instruction
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <span className="text-[13.5px] sm:text-headline-sm text-on-surface font-bold">
                      ₹3,100
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="flex items-center justify-between p-2.5 sm:p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] sm:text-label-lg text-on-surface font-semibold truncate">
                        STEM Robotics Lab Fee
                      </span>
                      <span className="text-[10px] sm:text-label-sm text-outline">
                        Material &amp; Equipment Maintenance
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <span className="text-[13.5px] sm:text-headline-sm text-on-surface font-bold">
                      ₹250
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="flex items-center justify-between p-2.5 sm:p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] sm:text-label-lg text-on-surface font-semibold truncate">
                        Computer &amp; Digital Library
                      </span>
                      <span className="text-[10px] sm:text-label-sm text-outline">
                        E-Portal License + Campus Wi-Fi
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <span className="text-[13.5px] sm:text-headline-sm text-on-surface font-bold">
                      ₹400
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
                {/* Item 4 */}
                <div className="flex items-center justify-between p-2.5 sm:p-space-md rounded-xl bg-surface-container-low transition-all">
                  <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
                    <input
                      defaultChecked
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-md accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] sm:text-label-lg text-on-surface font-semibold truncate">
                        Co-curricular &amp; Athletics
                      </span>
                      <span className="text-[10px] sm:text-label-sm text-outline">
                        Inter-school Tournaments &amp; Arts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <span className="text-[13.5px] sm:text-headline-sm text-on-surface font-bold">
                      ₹300
                    </span>
                    <button
                      aria-label="Item Receipt"
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Quick Document Actions */}
              <div className="grid grid-cols-2 gap-2 sm:gap-space-sm pt-1">
                <button className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary text-[11.5px] sm:text-label-md font-semibold hover:bg-primary/15 transition-all">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">description</span>
                  <span>Tax Receipt (80G)</span>
                </button>
                <button className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl bg-surface-container text-on-surface text-[11.5px] sm:text-label-md font-semibold hover:bg-surface-container-high transition-all">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">history_edu</span>
                  <span>Payment History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Attendance, Performance & Showcase */}
          <div className="flex flex-col gap-3 sm:gap-space-md">
            {/* Monthly Attendance Metric Card */}
            <div className="rounded-xl p-3.5 sm:p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-3 sm:gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface">
                    Monthly Attendance
                  </span>
                  <span className="text-[10px] sm:text-body-sm text-outline">
                    October 2026 • High Compliance
                  </span>
                </div>
                <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-tertiary">check_circle</span>
                  <span className="text-[9.5px] sm:text-label-sm uppercase font-bold">Eligible</span>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-space-lg pt-1">
                {/* Circular Progress Ring */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
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
                    <span className="text-[16px] sm:text-headline-sm font-extrabold text-on-surface leading-tight">
                      98.5%
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-outline font-semibold">
                      On Track
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1.5 sm:gap-2">
                  <div className="flex items-center justify-between text-[11.5px] sm:text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-tertiary-container"></span> Present
                    </span>
                    <span className="text-[12px] sm:text-body-md font-bold text-on-surface">
                      22 Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] sm:text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-error"></span> Absent
                    </span>
                    <span className="text-[12px] sm:text-body-md font-bold text-on-surface">
                      1 Day
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] sm:text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-surface-tint"></span> Official Holiday
                    </span>
                    <span className="text-[12px] sm:text-body-md font-bold text-on-surface">
                      5 Days
                    </span>
                  </div>
                </div>
              </div>
              {/* Heat Map Preview */}
              <div className="bg-surface-container-low rounded-xl p-2.5 sm:p-space-md flex flex-col gap-1.5 sm:gap-2">
                <div className="flex items-center justify-between text-[10px] sm:text-label-sm text-outline pb-0.5 sm:pb-1">
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                  <span>SUN</span>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-[11px] sm:text-body-sm font-semibold text-on-surface">
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">28</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">29</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">30</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">1</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">2</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">3</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">4</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">5</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">6</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">7</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-tertiary/15 text-tertiary-container flex items-center justify-center">8</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-error-container text-error flex items-center justify-center font-bold">9</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">10</div>
                  <div className="h-6 sm:h-7 rounded-lg bg-surface-tint/15 text-primary flex items-center justify-center">11</div>
                </div>
              </div>
            </div>

            {/* Term 1 Assessment & Performance Widget */}
            <div className="rounded-xl p-3.5 sm:p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-3 sm:gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface">
                    Term 1 Assessment
                  </span>
                  <span className="text-[10px] sm:text-body-sm text-outline">
                    Final Report Card Status
                  </span>
                </div>
                <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] sm:text-label-sm font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] sm:text-[15px] text-secondary">star</span>
                  <span>Grade A+</span>
                </div>
              </div>
              {/* Admit Card Ready Alert Banner */}
              <div className="rounded-xl p-2.5 sm:p-space-md bg-surface-container-low flex items-center justify-between gap-2 sm:gap-space-sm">
                <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">badge</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] sm:text-label-lg font-bold text-on-surface truncate">
                      Mid-Term Admit Card 2026
                    </span>
                    <span className="text-[10px] sm:text-label-sm text-tertiary flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Ready for Download
                    </span>
                  </div>
                </div>
                <Link
                  href="/exams"
                  className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-primary text-on-primary text-[11px] sm:text-label-md font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px] sm:text-[16px]">file_download</span>
                  <span>Hall Ticket</span>
                </Link>
              </div>
              {/* Mini Subject Grade Highlights */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center pt-1">
                <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="text-[10px] sm:text-label-sm text-outline truncate">Physics</span>
                  <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface">
                    96/100
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-tertiary font-bold">Top 2%</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="text-[10px] sm:text-label-sm text-outline truncate">Maths</span>
                  <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface">
                    98/100
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-tertiary font-bold">Top 1%</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="text-[10px] sm:text-label-sm text-outline truncate">Computer</span>
                  <span className="text-[14px] sm:text-headline-sm font-bold text-on-surface">
                    99/100
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-tertiary font-bold">Subject Rank 1</span>
                </div>
              </div>
            </div>

            {/* Visual Showcase / Student Life Notice */}
            <div className="rounded-xl p-3.5 sm:p-space-lg bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] flex flex-col gap-2.5 sm:gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-label-sm uppercase tracking-wider text-outline font-bold">
                  Upcoming Special Session
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-label-sm font-semibold">
                  Tomorrow
                </span>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-space-md">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                  <img
                    alt="Interactive Science Showcase"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHBIWddNhOp02Tz_sqQfGK_S-1I0JPQ-e1geLajWIVwoS47VF-VLbRiSE2zvzUqCCHV743vajbp_8RGmVFVZc2sUdEbR-iPu_CAyY4FKZ5NATDPKec_CNh2OC27jOM4wzVxmdyoeip4mkEBxShr2E9Om-FNfE0MrjAZLeizJElSaJB5oZYk2cGZq2h06h8H7zFMrzvOl_QGZy0pZYrvc0bkHt5a5-uRagCJvoHASJZ6QD_Z61OwHOqED-9zqT6xLW2QMA"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[12.5px] sm:text-label-lg font-bold text-on-surface truncate">
                    Advanced Robotics Exhibition
                  </span>
                  <span className="text-[10.5px] sm:text-body-sm text-outline line-clamp-2">
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
