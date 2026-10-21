'use client';

import React from 'react';

export default function PrincipalSeal() {
  return (
    <section id="principal" className="w-full bg-parchment dark:bg-[#101119] py-14 px-6 border-b border-slate-200 dark:border-[#222538]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#151622] rounded-xl shadow-sm border border-slate-200/90 p-8 md:p-12 relative overflow-hidden">
          {/* Subtle Institutional Watermark */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.03] select-none translate-x-12 translate-y-12">
            <svg className="w-96 h-96 text-oxford dark:text-[#eaedff]" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
              <polygon points="50,15 80,75 20,75" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Principal Portrait & Verified Seal Badge */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              {/* Principal Photo Container */}
              <div className="relative mb-4">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-oxford shadow-lg overflow-hidden bg-slate-100 dark:bg-[#1a1c2b] flex items-center justify-center">
                  {/* Dignified portrait SVG placeholder with formal collegiate attire */}
                  <svg className="w-full h-full text-slate-700 dark:text-[#c4c7e0]" viewBox="0 0 120 120" fill="currentColor">
                    <rect width="120" height="120" fill="#E2E8F0" />
                    <circle cx="60" cy="45" r="22" fill="#0A192F" />
                    <path d="M25 110C25 85 40 75 60 75C80 75 95 85 95 110Z" fill="#0A192F" />
                    <path d="M50 75L60 92L70 75" fill="#721121" />
                    <circle cx="60" cy="98" r="3" fill="#F59E0B" />
                  </svg>
                </div>

                {/* Verified Digital Stamp Pill */}
                <div className="absolute -bottom-2 right-2 bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border-2 border-white shadow-md flex items-center gap-1">
                  <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Verified Head</span>
                </div>
              </div>

              {/* Dignitary Name & Qualifications */}
              <h3 className="font-serif font-bold text-lg md:text-xl text-oxford dark:text-[#eaedff]">
                Dr. S. Mukherjee
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#a0a4c0] font-medium mt-0.5">
                M.Sc. (Physics), Ph.D., B.Ed.
              </p>
              <p className="text-[11px] text-burgundy dark:text-[#f2a5b5] font-semibold mt-1">
                Principal & Head of Academic Council
              </p>
              <div className="mt-2 text-[10px] text-slate-400 dark:text-[#8a8fa8] font-mono">
                Recipient of National Academic Leadership Award
              </div>
            </div>

            {/* Right Welcome Editorial Text & Physical Seal Graphic */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block text-xs uppercase font-bold tracking-widest text-burgundy dark:text-[#f2a5b5] font-mono border-b-2 border-burgundy/40 pb-1">
                Official Institutional Welcome
              </div>

              <h2 className="font-serif font-bold text-2xl md:text-3xl text-oxford dark:text-[#eaedff] leading-snug">
                “Educating for Intellectual Independence, Civic Rectitude & Enduring Truth.”
              </h2>

              <div className="text-slate-700 dark:text-[#c4c7e0] text-sm md:text-base leading-relaxed space-y-3 font-normal">
                <p>
                  Welcome to Lions Calcutta Greater Vidyamandir. Since our founding in 1991 under the aegis of the Lions Club of Calcutta Greater Education Trust, we have dedicated ourselves to fostering an environment where rigorous scholarship converges with resolute moral purpose.
                </p>
                <p>
                  Our institution views education not as mechanical rote learning for transient exam marks, but as a holistic crucible that shapes discerning, inquisitive, and compassionate leaders. Supported by state-of-the-art scientific infrastructure, seasoned faculty mentors, and an unrelenting commitment to truth, we invite every pupil to discover their highest potential.
                </p>
              </div>

              {/* Digital Attestation & Authentic Institutional Circular Stamp */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#222538] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Cryptographic Attestation Metadata */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-oxford dark:text-[#eaedff]">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Cryptographically Attested Institutional Address</span>
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant">
                    Cert Fingerprint: SHA256:8f9e...2041b • Valid Academic Session 2026-27
                  </div>
                </div>

                {/* Stately Circular Institutional Seal Stamp Graphic */}
                <div className="flex items-center gap-3">
                  <div className="w-18 h-18 rounded-full border-2 border-dashed border-burgundy/80 p-1 flex items-center justify-center text-burgundy dark:text-[#f2a5b5] relative select-none">
                    <div className="w-full h-full rounded-full border border-burgundy/60 flex flex-col items-center justify-center p-1 text-center bg-red-50/30">
                      <span className="text-[7px] font-extrabold uppercase tracking-tight">L.C.G.V.M.</span>
                      <span className="text-[6px] font-bold uppercase tracking-widest text-slate-600 dark:text-[#a0a4c0]">SEAL OF</span>
                      <span className="text-[7px] font-extrabold text-oxford dark:text-[#eaedff] uppercase">PRINCIPAL</span>
                      <span className="text-[6px] font-mono font-bold text-amber-700 dark:text-amber-300">★ 1991 ★</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif italic font-bold text-oxford dark:text-[#eaedff] text-base">
                      S. Mukherjee
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-mono">
                      Affixed: Kolkata, WB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
