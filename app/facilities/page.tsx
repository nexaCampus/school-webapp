'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import BusRouteDirectory from '@/components/public/BusRouteDirectory';
import PortalFooter from '@/components/PortalFooter';

const FACILITIES_DATA = [
  {
    title: 'Smart STEM & Robotics Center',
    desc: 'Equipped with 3D printers, IoT microcontrollers, automated testbeds and dedicated robotic simulation bays.',
    metric: '14 Specialized Labs',
  },
  {
    title: 'Olympic-Standard Sports Complex',
    desc: 'Synthetic track, badminton pavilion, cricket training nets, basketball courts, and full-sized football pitch.',
    metric: '12.5 Acres Sprawl',
  },
  {
    title: 'Centennial Central Library',
    desc: 'Over 45,000 academic titles, peer-reviewed international scientific journals, and silent digital carrels.',
    metric: '45,000+ Volumes',
  },
  {
    title: 'Health & Medical Infirmary',
    desc: 'Full-time resident medical officer, trained nursing staff, emergency oxygen, and tie-up with multi-specialty hospitals.',
    metric: '24/7 Paramedic Bay',
  },
];

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#101119] flex flex-col justify-between font-sans text-[#131b2e] dark:text-[#eaedff] transition-colors">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Section Header */}
        <div className="border-b border-slate-300 dark:border-[#2b2f48] pb-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
            Campus Infrastructure & Telematics
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-oxford dark:text-[#eaedff] mt-1.5">
            Campus Facilities & Transit Directory
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-[#a0a4c0] mt-2 max-w-3xl leading-relaxed">
            State-of-the-art facilities engineered to stimulate scientific inquiry, athletic grit, and student safety across our 12.5-acre campus.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACILITIES_DATA.map((fac) => (
            <div
              key={fac.title}
              className="bg-white dark:bg-[#151622] rounded-xl p-6 border border-slate-200 dark:border-[#222538] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                  {fac.metric}
                </span>
                <h2 className="font-serif font-bold text-base text-oxford dark:text-[#eaedff] mt-3">
                  {fac.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#a0a4c0] mt-2 leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transit & Bus Directory */}
        <section id="transit" className="space-y-3 pt-4">
          <BusRouteDirectory />
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
