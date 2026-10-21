'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface ProvisioningState {
  // Step 1: Identity
  officialName: string;
  board: 'CBSE' | 'CISCE' | 'Cambridge' | 'State Board';
  affiliationNumber: string;
  principalName: string;
  officialEmail: string;
  contactPhone: string;
  city: string;
  state: string;

  // Step 2: Slug
  subdomainSlug: string;

  // Step 3: Branding
  motto: string;
  palette: 'oxford' | 'burgundy' | 'cypress' | 'indigo';
  crestLetter: string;

  // Step 4: Template
  template: 'classic' | 'modern' | 'stem';
}

const RESERVED_SLUGS = ['admin', 'api', 'root', 'login', 'portal', 'auth', 'mail', 'app', 'system'];

const PALETTE_OPTIONS = [
  {
    id: 'oxford',
    label: 'Oxford Navy & Gold',
    primary: '#0A192F',
    accent: '#D97706',
    desc: 'Stately academic gravitas with warm amber honors',
  },
  {
    id: 'burgundy',
    label: 'Heritage Burgundy & Ivory',
    primary: '#721121',
    accent: '#B45309',
    desc: 'Classic centenary university & convent aesthetic',
  },
  {
    id: 'cypress',
    label: 'Forest Cypress & Parchment',
    primary: '#1B382B',
    accent: '#059669',
    desc: 'Scholastic natural philosophy & discipline',
  },
  {
    id: 'indigo',
    label: 'Royal Indigo & Slate',
    primary: '#1E3A8A',
    accent: '#3B82F6',
    desc: 'Contemporary metropolitan institutional tone',
  },
];

const TEMPLATES = [
  {
    id: 'classic',
    title: 'Classic Heritage',
    desc: 'Formal editorial serif headings, gazette bulletin ticker, verified circular stamps, and traditional crest architecture.',
    badge: 'Recommended for CBSE/ICSE',
  },
  {
    id: 'modern',
    title: 'Modern Academic',
    desc: 'Crisp geometric typography, high data-density course cards, streamlined fee matrices, and agile mobile navigation.',
    badge: 'Popular',
  },
  {
    id: 'stem',
    title: 'STEM & Tech-Forward',
    desc: 'Robotics & laboratory telemetry focus, coding curriculum highlights, research paper showcases, and digital admissions.',
    badge: 'Specialized',
  },
];

export default function ProvisioningWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProvisioned, setIsProvisioned] = useState(false);

  const [form, setForm] = useState<ProvisioningState>({
    officialName: 'Saraswati Centennial Vidyapeeth',
    board: 'CBSE',
    affiliationNumber: 'CBSE-REG-1930492',
    principalName: 'Dr. Rameshwar Shastry',
    officialEmail: 'principal@scv.edu.in',
    contactPhone: '+91 (033) 2490-1122',
    city: 'Kolkata',
    state: 'West Bengal',
    subdomainSlug: 'scv',
    motto: 'Knowledge is the Ultimate Liberator',
    palette: 'oxford',
    crestLetter: 'S',
    template: 'classic',
  });

  // Slug validation helper
  const cleanSlug = form.subdomainSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const isReserved = RESERVED_SLUGS.includes(cleanSlug);
  const isValidSlug = cleanSlug.length >= 3 && !isReserved;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsProvisioned(true);
      setCurrentStep(5);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full bg-white dark:bg-[#151622] rounded-xl shadow-sm border border-slate-200 dark:border-[#222538] overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="bg-oxford text-white p-6 md:p-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-amber-400 font-mono text-xs uppercase font-bold tracking-widest">
              NexaCampus Tenant Provisioning Engine
            </div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-white mt-1">
              Self-Service School Portal Builder
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Provision a production-ready, fully responsive institutional web portal with verified CBSE/CISCE compliance tables, fee management & online admission forms in under 3 minutes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              5-Step Provisioner
            </span>
          </div>
        </div>
      </div>

      {/* Wizard Step Progression Bar */}
      <div className="bg-slate-50 dark:bg-[#101119] px-6 py-4 border-b border-slate-200 dark:border-[#222538]">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'Slug Claim' },
            { num: 3, label: 'Branding' },
            { num: 4, label: 'Template' },
            { num: 5, label: 'Deployment' },
          ].map((st) => {
            const isCompleted = currentStep > st.num || (currentStep === 5 && isProvisioned);
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-700 text-white'
                      : isCurrent
                      ? 'bg-oxford text-amber-300 ring-2 ring-amber-400'
                      : 'bg-slate-200 dark:bg-[#222538] text-slate-600 dark:text-[#a0a4c0]'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span
                  className={`hidden sm:inline font-semibold ${
                    isCurrent ? 'text-oxford dark:text-[#eaedff]' : 'text-on-surface-variant'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Body Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-[500px] flex flex-col justify-between">
        {/* ============================================================ */}
        {/* STEP 1: INSTITUTIONAL IDENTITY                                */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
                Step 1 of 5
              </span>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-oxford dark:text-[#eaedff] mt-0.5">
                Institutional Identity & Accreditation
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Enter your official school name and government board affiliation details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Full Registered Name of School / Vidyapeeth *
                </label>
                <input
                  type="text"
                  value={form.officialName}
                  onChange={(e) => setForm({ ...form, officialName: e.target.value })}
                  placeholder="e.g. Saraswati Centennial Vidyapeeth"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df] text-slate-800 dark:text-[#dfe2f4] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Affiliation Board *
                </label>
                <select
                  aria-label="Affiliation board"
                  value={form.board}
                  onChange={(e) => setForm({ ...form, board: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df] text-slate-800 dark:text-[#dfe2f4]"
                >
                  <option value="CBSE">Central Board of Secondary Education (CBSE)</option>
                  <option value="CISCE">Council for the Indian School Certificate (CISCE)</option>
                  <option value="Cambridge">Cambridge International / IGCSE</option>
                  <option value="State Board">State Secondary Education Board</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Board Affiliation / School Code *
                </label>
                <input
                  type="text"
                  value={form.affiliationNumber}
                  onChange={(e) => setForm({ ...form, affiliationNumber: e.target.value })}
                  placeholder="e.g. 1930492 or WB-243"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df] font-mono text-slate-800 dark:text-[#dfe2f4]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Head of School / Principal Name *
                </label>
                <input
                  type="text"
                  value={form.principalName}
                  onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                  placeholder="e.g. Dr. Rameshwar Shastry"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white text-slate-800 dark:text-[#dfe2f4]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Official Institutional Email *
                </label>
                <input
                  type="email"
                  value={form.officialEmail}
                  onChange={(e) => setForm({ ...form, officialEmail: e.target.value })}
                  placeholder="principal@scv.edu.in"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white text-slate-800 dark:text-[#dfe2f4]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  City & State *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="w-1/2 p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white text-slate-800 dark:text-[#dfe2f4]"
                  />
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    className="w-1/2 p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white text-slate-800 dark:text-[#dfe2f4]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Primary Helpline Contact *
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="+91 (033) 2490-1122"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white text-slate-800 dark:text-[#dfe2f4] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: SUBDOMAIN SLUG CLAIM                                 */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
                Step 2 of 5
              </span>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-oxford dark:text-[#eaedff] mt-0.5">
                Claim Subdomain Slug
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Your institution will receive an instantly accessible, secure subdomain on the NexaCampus high-speed edge network.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                  Subdomain Slug Address *
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 dark:border-[#2b2f48] overflow-hidden bg-white dark:bg-[#151622] shadow-2xs focus-within:ring-2 focus-within:ring-oxford">
                  <span className="px-3 py-2.5 text-xs text-slate-400 dark:text-[#8a8fa8] font-mono bg-slate-100 dark:bg-[#1a1c2b] border-r border-slate-200 dark:border-[#222538]">
                    https://
                  </span>
                  <input
                    type="text"
                    value={form.subdomainSlug}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        subdomainSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                      })
                    }
                    placeholder="my-school"
                    className="flex-1 px-3 py-2.5 text-sm font-mono font-bold text-oxford dark:text-[#eaedff] focus:outline-hidden"
                  />
                  <span className="px-3 py-2.5 text-xs text-on-surface-variant font-mono bg-slate-100 dark:bg-[#1a1c2b] border-l border-slate-200 dark:border-[#222538] font-bold">
                    .nexacampus.com
                  </span>
                </div>
              </div>

              {/* Real-time Status Badge */}
              <div className="text-xs font-mono">
                {isReserved ? (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
                    <span className="font-bold">❌ Reserved Slug:</span>
                    <span>&quot;{cleanSlug}&quot; is reserved for system infrastructure. Please choose another identifier.</span>
                  </div>
                ) : isValidSlug ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 rounded-lg border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="font-bold">Available!</span>
                      <span>Target: https://{cleanSlug}.nexacampus.com</span>
                    </div>
                    <span className="text-[11px] bg-emerald-200/80 px-2 py-0.5 rounded font-bold">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-[#101119] text-slate-600 dark:text-[#a0a4c0] rounded-lg border border-slate-200 dark:border-[#222538]">
                    Enter at least 3 alphanumeric characters (hyphens allowed).
                  </div>
                )}
              </div>

              {/* Apex Domain Note */}
              <div className="bg-slate-50 dark:bg-[#101119] p-4 rounded-lg border border-slate-200 dark:border-[#222538] text-xs text-slate-600 dark:text-[#a0a4c0] space-y-1">
                <div className="font-bold text-oxford dark:text-[#eaedff]">Need a Custom Apex Domain?</div>
                <p>
                  You can bind your own apex domain (e.g. <code>www.scvkolkata.edu.in</code>) with free automatic SSL provisioning directly from your Tenant Admin Dashboard after initial setup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: BRANDING & COLOR TOKENS                              */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
                Step 3 of 5
              </span>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-oxford dark:text-[#eaedff] mt-0.5">
                Institutional Branding & Heritage Palette
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Conform your digital presence to institutional heraldry, mottos, and dignified academic color schemes.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* Crest Monogram Letter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                    Crest Monogram Character *
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={form.crestLetter}
                    onChange={(e) => setForm({ ...form, crestLetter: e.target.value.toUpperCase() })}
                    className="w-24 p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded font-serif font-bold text-center text-lg text-oxford dark:text-[#eaedff] uppercase"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-[#8a8fa8] mt-1">
                    Initials for your verified heraldic shield stamp.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                    Institutional Latin / Sanskrit Motto *
                  </label>
                  <input
                    type="text"
                    value={form.motto}
                    onChange={(e) => setForm({ ...form, motto: e.target.value })}
                    placeholder="e.g. Tamaso Ma Jyotirgamaya"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded font-serif italic text-slate-800 dark:text-[#dfe2f4]"
                  />
                </div>
              </div>

              {/* Grounded Institutional Palette Picker */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-2">
                  Select Institutional Color Hierarchy:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PALETTE_OPTIONS.map((pal) => (
                    <div
                      key={pal.id}
                      onClick={() => setForm({ ...form, palette: pal.id as any })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        form.palette === pal.id
                          ? 'border-oxford bg-slate-50 dark:bg-[#101119] shadow-xs'
                          : 'border-slate-200 dark:border-[#222538] hover:border-slate-300 dark:hover:border-[#343a55]'
                      }`}
                    >
                      <div className="flex -space-x-2 pt-1 flex-shrink-0">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                          style={{ backgroundColor: pal.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                          style={{ backgroundColor: pal.accent }}
                        />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-xs text-slate-900 dark:text-[#eaedff]">
                          {pal.label}
                        </div>
                        <div className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                          {pal.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: TEMPLATE PICKER                                      */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
                Step 4 of 5
              </span>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-oxford dark:text-[#eaedff] mt-0.5">
                Select Architectural Page Template
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Choose the information layout model tailored to your school curriculum and heritage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setForm({ ...form, template: tmpl.id as any })}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    form.template === tmpl.id
                      ? 'border-oxford bg-slate-50 dark:bg-[#101119] shadow-sm'
                      : 'border-slate-200 dark:border-[#222538] hover:border-slate-300 dark:hover:border-[#343a55] bg-white dark:bg-[#151622]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-[#222538] text-slate-700 dark:text-[#c4c7e0]">
                      {tmpl.badge}
                    </span>
                    <h3 className="font-serif font-bold text-base text-oxford dark:text-[#eaedff] mt-2">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#a0a4c0] mt-2 leading-relaxed">
                      {tmpl.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#222538] text-xs font-bold text-oxford dark:text-[#eaedff] flex items-center justify-between">
                    <span>{form.template === tmpl.id ? 'Selected ✓' : 'Select'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 5: INSTANT DEPLOYMENT CONFIRMATION                      */}
        {/* ============================================================ */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in text-center my-auto py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              ✓
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-200">
                Institutional Tenant Provisioned
              </span>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-oxford dark:text-[#eaedff] mt-1">
                {form.officialName} is Live
              </h2>
              <p className="text-xs text-slate-600 dark:text-[#a0a4c0] max-w-lg mx-auto mt-2">
                Your web portal has been successfully provisioned on the NexaCampus Multi-Tenant Cloud. All compliance tables, fee calculators, and digital admission wizards are operational.
              </p>
            </div>

            {/* Live Subdomain URL Box */}
            <div className="bg-slate-50 dark:bg-[#101119] max-w-md mx-auto p-4 rounded-xl border border-slate-200 dark:border-[#222538] space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-[#222538]">
                <span className="text-on-surface-variant">Live URL:</span>
                <span className="font-bold text-oxford dark:text-[#eaedff]">
                  https://{cleanSlug}.nexacampus.com
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-[#222538]">
                <span className="text-on-surface-variant">Board Affiliation:</span>
                <span className="font-bold text-slate-800 dark:text-[#dfe2f4]">
                  {form.board} ({form.affiliationNumber})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">SSL Certificate:</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Auto-Provisioned (TLS 1.3)</span>
              </div>
            </div>

            {/* DNS Instructions for Custom Apex Domain */}
            <div className="bg-parchment dark:bg-[#101119] max-w-md mx-auto p-4 rounded-xl border border-slate-200 dark:border-[#222538] text-left text-xs text-slate-700 dark:text-[#c4c7e0] space-y-1">
              <div className="font-bold text-oxford dark:text-[#eaedff]">Optional: DNS CNAME Delegation</div>
              <p className="text-[11px] text-slate-600 dark:text-[#a0a4c0]">
                To point your custom domain (e.g. <code>portal.yourinstitution.edu.in</code>), create a CNAME record pointing to:
              </p>
              <div className="font-mono bg-white dark:bg-[#151622] p-2 rounded border border-slate-200 dark:border-[#222538] text-[11px] text-oxford dark:text-[#eaedff] font-bold">
                CNAME → cname.nexacampus.com
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/admin/cms"
                className="px-5 py-2.5 bg-oxford hover:bg-slate-800 text-white rounded-md text-xs font-bold transition-all shadow-sm"
              >
                Launch Tenant CMS Admin Dashboard →
              </Link>
              <Link
                href={`/?tenant=${cleanSlug}`}
                className="px-5 py-2.5 bg-slate-100 dark:bg-[#1a1c2b] hover:bg-slate-200 text-slate-800 dark:text-[#dfe2f4] rounded-md text-xs font-bold border border-slate-300 dark:border-[#2b2f48]"
              >
                Preview Live Web Portal
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        {currentStep < 5 && (
          <div className="pt-6 border-t border-slate-200 dark:border-[#222538] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-md border border-slate-300 dark:border-[#2b2f48] ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-[#8a8fa8]'
                  : 'text-slate-700 dark:text-[#c4c7e0] hover:bg-slate-100 dark:hover:bg-[#222538]'
              }`}
            >
              ← Previous Step
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === 2 && (!isValidSlug || isReserved)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-oxford hover:bg-slate-800 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? 'Deploy Institutional Portal 🚀' : 'Continue to Next Step →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
