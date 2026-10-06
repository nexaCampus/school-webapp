'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearSession, getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [studentData, setStudentData] = useState({
    name: 'Student',
    grade: '—',
    section: '—',
    rollNo: '—',
    admissionId: '—',
    dob: '—',
    bloodGroup: '—',
    fatherName: 'Not provided',
    motherName: 'Not provided',
    phone: 'Not provided',
    email: 'Not provided',
    address: 'Not provided',
  });

  useEffect(() => {
    const s = getSession();
    if (!s?.student && !s?.name) {
      window.location.replace('/chooser');
      return;
    }
    const st = s?.student;
    if (st) {
      setStudentData({
        name: st.displayName || st.name || s.name || 'Student',
        grade: st.grade || '12',
        section: st.section || 'A',
        rollNo: st.rollNo || '—',
        admissionId: st.id || 'N/A',
        dob: st.dob || '—',
        bloodGroup: st.bloodGroup || '—',
        fatherName: st.fatherName || 'Not provided',
        motherName: st.motherName || 'Not provided',
        phone: st.contactPhone || 'Not provided',
        email: st.guardianEmail || s.email || 'Not provided',
        address: st.residentialAddress || 'Subhasgram, Kolkata',
      });
    } else if (s?.name) {
      setStudentData((prev) => ({
        ...prev,
        name: s.name,
        email: s.email || 'Not provided',
      }));
    }
  }, []);

  function handleLogout() {
    clearSession();
    router.replace('/chooser');
  }

  return (
    <PortalShell title="Profile" activePath="profile">
      <div className="flex flex-col gap-space-lg">
        {/* 2-Column Responsive Layout on Laptop (lg:), Single Column on Phone */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 flex flex-col gap-space-md">
          {/* Left Column: Student Identity Card (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="relative w-full rounded-lg bg-surface-container-lowest p-space-lg shadow-[0_12px_28px_-6px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(59,73,223,0.04)] overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
              <div className="absolute top-1/2 -left-10 w-28 h-28 rounded-full bg-secondary-fixed/40 blur-xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-space-sm">
                  <div className="w-24 h-24 rounded-full p-1 bg-surface-container-high shadow-md">
                    <img
                      alt={studentData.name}
                      className="w-full h-full object-cover rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2HL6mlKQFX_TInOT64dMFoflC4pOZFhVO5vC5KUg1zG9aHWIOAG0BaM1MKOq5v0-qHFzN-DbWra0R-q7csvdmGY2a4mn1n3BTf4p5TiCeBP5PLiuuzrRqvOFPDb4JC8ND8nLDArYAjww0YpZMpS-hcdGZOaAEEZc5c145anZkYFBjtzMVFHzb5MK3JXtUSrInlrm8-i6kElfgmG6pQgJJv6m10BZjJ9goEvKG0Mr6qs3VDu4p0sD1Bw"
                    />
                  </div>
                  <div
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-[0_2px_8px_rgba(0,80,54,0.35)]"
                    title="Verified Record"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                </div>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1">
                  {studentData.name}
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-md mb-space-xs">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>
                    Class {studentData.grade} • Section {studentData.section}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm uppercase tracking-wider mb-space-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  <span>Active Student • AY 2026-2027</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm w-full pt-space-xs">
                  <div className="bg-surface-container-low rounded-DEFAULT p-3 flex flex-col items-center justify-center">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                      Roll Number
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                      {studentData.rollNo}
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-DEFAULT p-3 flex flex-col items-center justify-center">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                      Admission ID
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary mt-0.5">
                      #{studentData.admissionId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Logout Trigger */}
            <div className="flex flex-col gap-2">
              <button
                className="w-full py-3.5 px-space-md rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all duration-200 flex items-center justify-center gap-2 shadow-sm font-label-lg text-label-lg active:scale-[0.98]"
                onClick={() => setShowLogoutModal(true)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Log Out of Account</span>
              </button>
              <p className="font-label-sm text-label-sm text-outline text-center">
                Version 3.4.1 (Build 2026.04) • EduPortal Student OS
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Info & Preferences (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Student & Guardian Details */}
            <div>
              <div className="flex items-center justify-between px-1 mb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Student &amp; Guardian Details
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Official Data
                </span>
              </div>
              <div className="rounded-lg bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                    <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-sm text-label-sm text-outline">Date of Birth</p>
                      <p className="font-body-md text-body-md text-on-surface font-semibold truncate">
                        {studentData.dob}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                    <div className="w-9 h-9 rounded-full bg-error-container/40 flex items-center justify-center text-error flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">bloodtype</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-sm text-label-sm text-outline">Blood Group</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error font-label-md text-label-md font-bold">
                        {studentData.bloodGroup}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-sm text-label-sm text-outline">Father's Name</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                      {studentData.fatherName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">face_3</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-sm text-label-sm text-outline">Mother's Name</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                      {studentData.motherName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-sm text-label-sm text-outline">Registered Mobile</p>
                      <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                        {studentData.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                      aria-label="Call Registered Contact"
                      className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition-transform"
                      href={`tel:${studentData.phone.replace(/\s+/g, '')}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </a>
                    <a
                      aria-label="Message Registered Contact"
                      className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center hover:bg-primary-fixed active:scale-95 transition-transform"
                      href={`sms:${studentData.phone.replace(/\s+/g, '')}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">sms</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-sm text-label-sm text-outline">Guardian Email</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                      {studentData.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-space-sm p-space-sm rounded-DEFAULT bg-surface-container-low">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-sm text-label-sm text-outline">Residential Address</p>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                      {studentData.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Attendance Card (Integrated from Attendance Portal) */}
            <div>
              <div className="flex items-center justify-between px-1 mb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">event_available</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Monthly Attendance
                  </h2>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                  <span className="font-label-sm text-label-sm uppercase font-semibold">98.5% High Compliance</span>
                </div>
              </div>

              <div className="rounded-2xl p-space-md bg-surface-container-lowest shadow-sm border border-outline/10 flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] font-bold text-on-surface">
                      October 2026
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Academic Term 1 • 28 Working Days
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                    Eligible for Exams
                  </span>
                </div>

                {/* Metric Ring & Count Breakdown */}
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
                      />
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
                      />
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

                  {/* Summary Counters: Green for Present, Red for Absent, Blue for Official Holiday */}
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="flex items-center justify-between text-body-sm p-1.5 rounded-lg bg-[#006b49]/10">
                      <span className="text-[#006b49] flex items-center gap-2 font-label-md font-bold text-[13px]">
                        <span className="w-3 h-3 rounded-full bg-[#006b49]"></span> Present
                      </span>
                      <span className="font-headline-sm text-body-md font-extrabold text-[#006b49]">
                        22 Days
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm p-1.5 rounded-lg bg-[#ba1a1a]/10">
                      <span className="text-[#ba1a1a] flex items-center gap-2 font-label-md font-bold text-[13px]">
                        <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span> Absent
                      </span>
                      <span className="font-headline-sm text-body-md font-extrabold text-[#ba1a1a]">
                        1 Day
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm p-1.5 rounded-lg bg-[#1c2ac8]/10">
                      <span className="text-[#1c2ac8] flex items-center gap-2 font-label-md font-bold text-[13px]">
                        <span className="w-3 h-3 rounded-full bg-[#1c2ac8]"></span> Official Holiday
                      </span>
                      <span className="font-headline-sm text-body-md font-extrabold text-[#1c2ac8]">
                        5 Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full Month Calendar: Dates 1 to 31 with Green (Present), Red (Absent), Blue (Holiday) */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-1 border-b border-outline/10 text-[11px] font-bold text-outline">
                    <span>October 2026 Monthly Log</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#006b49]"></span> Present
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Absent
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#1c2ac8]"></span> Holiday
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-[11px] text-outline pb-1 font-bold">
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                    <span>SUN</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center font-body-sm text-[12px] font-semibold">
                    {/* Previous Month Padded Days */}
                    <div className="h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">28</div>
                    <div className="h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">29</div>
                    <div className="h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline opacity-40">30</div>

                    {/* October 1 to 31 Full Month Dates */}
                    {/* Oct 1-2 (Present - Green) */}
                    <div title="Oct 1: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">1</div>
                    <div title="Oct 2: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">2</div>
                    {/* Oct 3-4 (Weekend Holiday - Blue) */}
                    <div title="Oct 3: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">3</div>
                    <div title="Oct 4: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">4</div>

                    {/* Oct 5-8 (Present - Green), Oct 9 (Absent - Red), Oct 10-11 (Holiday - Blue) */}
                    <div title="Oct 5: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">5</div>
                    <div title="Oct 6: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">6</div>
                    <div title="Oct 7: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">7</div>
                    <div title="Oct 8: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">8</div>
                    <div title="Oct 9: Absent (Sick Leave)" className="h-8 rounded-lg bg-[#ba1a1a]/20 text-[#ba1a1a] border border-[#ba1a1a]/40 flex items-center justify-center font-extrabold ring-1 ring-[#ba1a1a]/30">9</div>
                    <div title="Oct 10: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">10</div>
                    <div title="Oct 11: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">11</div>

                    {/* Oct 12-16 (Present - Green), Oct 17-18 (Holiday - Blue) */}
                    <div title="Oct 12: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">12</div>
                    <div title="Oct 13: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">13</div>
                    <div title="Oct 14: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">14</div>
                    <div title="Oct 15: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">15</div>
                    <div title="Oct 16: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">16</div>
                    <div title="Oct 17: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">17</div>
                    <div title="Oct 18: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">18</div>

                    {/* Oct 19-23 (Present - Green), Oct 24-25 (Holiday - Blue) */}
                    <div title="Oct 19: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">19</div>
                    <div title="Oct 20: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">20</div>
                    <div title="Oct 21: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">21</div>
                    <div title="Oct 22: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">22</div>
                    <div title="Oct 23: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">23</div>
                    <div title="Oct 24: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">24</div>
                    <div title="Oct 25: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">25</div>

                    {/* Oct 26-30 (Present - Green), Oct 31 (Holiday - Blue) */}
                    <div title="Oct 26: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">26</div>
                    <div title="Oct 27: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">27</div>
                    <div title="Oct 28: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">28</div>
                    <div title="Oct 29: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">29</div>
                    <div title="Oct 30: Present" className="h-8 rounded-lg bg-[#006b49]/15 text-[#006b49] border border-[#006b49]/30 flex items-center justify-center font-bold">30</div>
                    <div title="Oct 31: Official Holiday" className="h-8 rounded-lg bg-[#1c2ac8]/15 text-[#1c2ac8] border border-[#1c2ac8]/30 flex items-center justify-center font-bold">31</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[12px]">
                  <Link href="/attendance" className="font-bold text-primary hover:underline flex items-center gap-1">
                    <span>View Detailed Term Logs &amp; Apply Leave</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                  <span className="text-outline text-[11px]">Synced with Campus Biometrics</span>
                </div>
              </div>
            </div>

            {/* Security & Preferences */}
            <div>
              <div className="flex items-center justify-between px-1 mb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Security &amp; App Preferences
                  </h2>
                </div>
              </div>
              <div className="rounded-lg bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-xs">
                <button
                  className="w-full flex items-center justify-between p-space-sm rounded-DEFAULT hover:bg-surface-container transition-colors text-left group"
                  type="button"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        Change Portal Password
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Last updated 45 days ago
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-0.5 transition-transform text-[20px]">
                    chevron_right
                  </span>
                </button>
                <div className="w-full flex items-center justify-between p-space-sm rounded-DEFAULT hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">mark_chat_unread</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        Push &amp; SMS Alerts
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Homework and attendance notices
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-2 flex-shrink-0">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mb-space-sm">
              <span className="material-symbols-outlined text-[30px]">warning</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Confirm Log Out?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              You will need your student admission ID (
              <strong className="text-on-surface">#{studentData.admissionId}</strong>) to re-enter the
              academic portal.
            </p>
            <div className="flex flex-col w-full gap-2">
              <button
                className="w-full py-3 rounded-full bg-error text-on-error font-label-lg text-label-lg shadow-sm hover:opacity-90 active:scale-95 transition-all"
                onClick={handleLogout}
                type="button"
              >
                Yes, Log Out
              </button>
              <button
                className="w-full py-3 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-container-highest active:scale-95 transition-all"
                onClick={() => setShowLogoutModal(false)}
                type="button"
              >
                Cancel &amp; Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
