'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function HealthPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  return (
    <PortalShell title="Health & Clinic" activePath="health">
      <div className="flex flex-col gap-space-lg">
        {/* Vitals Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-4 text-center">
            <span className="text-[12px] font-semibold text-outline uppercase tracking-wider">
              Blood Group
            </span>
            <p className="text-[20px] font-extrabold text-primary mt-1">A +ve</p>
          </div>
          <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-4 text-center">
            <span className="text-[12px] font-semibold text-outline uppercase tracking-wider">Height</span>
            <p className="text-[20px] font-extrabold text-primary mt-1">
              176<span className="text-[13px] font-bold text-outline"> cm</span>
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-[20px] shadow-sm p-4 text-center">
            <span className="text-[12px] font-semibold text-outline uppercase tracking-wider">Weight</span>
            <p className="text-[20px] font-extrabold text-primary mt-1">
              64<span className="text-[13px] font-bold text-outline"> kg</span>
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout on Tablet/Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allergies & Alerts */}
          <section className="bg-error-container/40 border border-error/20 rounded-[22px] p-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[22px]">warning</span>
              <h3 className="text-[15px] font-bold text-on-error-container">Medical Alerts &amp; Allergies</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-[12px] font-bold text-on-error-container bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm">
                Peanuts
              </span>
              <span className="text-[12px] font-bold text-on-error-container bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm">
                Penicillin
              </span>
              <span className="text-[12px] font-bold text-on-error-container bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm">
                Asthma Inhaler Required (Sports)
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-4 leading-relaxed">
              Dr. Banerjee on file. Guardian informed of mild dust sensitivity during physical training.
            </p>
          </section>

          {/* Nurse's Cabin Direct Call */}
          <section className="bg-surface-container-lowest rounded-[22px] shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-start gap-3.5">
              <span className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">medical_services</span>
              </span>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-on-surface">Campus Health Bay &amp; Nurse</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Block A, Ground Floor · Duty Nurse: Sister Mary
                </p>
                <p className="font-body-sm text-body-sm text-outline mt-1">
                  <a href="tel:+913324567890" className="hover:text-primary transition-colors">
                    +91 33 2456 7890 (Ext. 112)
                  </a>
                </p>
              </div>
            </div>
            <a
              href="tel:+913324567890"
              className="mt-4 h-[44px] rounded-full bg-tertiary text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-tertiary/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Call Health Desk</span>
            </a>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
