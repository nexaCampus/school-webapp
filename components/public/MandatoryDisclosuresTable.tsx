'use client';

import React, { useState } from 'react';

export interface DisclosureDocument {
  id: string;
  serial: number;
  title: string;
  category: 'Legal' | 'Safety' | 'Infrastructure' | 'Health' | 'Academic';
  referenceNo: string;
  issuingAuthority: string;
  validUntil: string;
  fileSize: string;
  pdfUrl?: string;
}

export const DISCLOSURE_DOCUMENTS: DisclosureDocument[] = [
  {
    id: 'doc-1',
    serial: 1,
    title: 'Copies of Affiliation / Upgradation Letter and Recent Extension of Affiliation',
    category: 'Legal',
    referenceNo: 'CISCE/AFF/WB-243/2025/119',
    issuingAuthority: 'Council for the Indian School Certificate Examinations, New Delhi',
    validUntil: 'Permanent Affiliation',
    fileSize: '1.4 MB',
  },
  {
    id: 'doc-2',
    serial: 2,
    title: 'Societies / Trust / Company Registration / Renewal Certificate',
    category: 'Legal',
    referenceNo: 'S/1991/4482-WB',
    issuingAuthority: 'Registrar of Societies, Govt. of West Bengal',
    validUntil: '31 Mar 2030',
    fileSize: '890 KB',
  },
  {
    id: 'doc-3',
    serial: 3,
    title: 'No Objection Certificate (NOC) Issued by State Government',
    category: 'Legal',
    referenceNo: '241-SE/P/10M-83/91',
    issuingAuthority: 'School Education Department, Govt. of West Bengal',
    validUntil: 'Perpetual',
    fileSize: '740 KB',
  },
  {
    id: 'doc-4',
    serial: 4,
    title: 'Building Safety Certificate as per National Building Code (NBC)',
    category: 'Safety',
    referenceNo: 'KMC/BLD/ENG/2025/7841',
    issuingAuthority: 'Kolkata Municipal Corporation & Structural Engineers Guild',
    validUntil: '30 Jun 2028',
    fileSize: '1.2 MB',
  },
  {
    id: 'doc-5',
    serial: 5,
    title: 'Fire Safety Certificate Issued by Competent Fire Services Authority',
    category: 'Safety',
    referenceNo: 'FS-WB/COL/2026/8839',
    issuingAuthority: 'West Bengal Fire & Emergency Services Directorate',
    validUntil: '31 Dec 2027',
    fileSize: '950 KB',
  },
  {
    id: 'doc-6',
    serial: 6,
    title: 'Safe Drinking Water and Sanitary Condition Certificate',
    category: 'Health',
    referenceNo: 'PHED/WATER-LAB/CAL/2026/042',
    issuingAuthority: 'Public Health Engineering Department Laboratory, Kolkata',
    validUntil: '15 Jan 2027',
    fileSize: '512 KB',
  },
  {
    id: 'doc-7',
    serial: 7,
    title: 'Campus Land Ownership & Allotment Certificate',
    category: 'Infrastructure',
    referenceNo: 'LND-REG/KOL/4491/1991',
    issuingAuthority: 'Land & Land Reforms Department, District Collectorate',
    validUntil: 'Freehold Land (12.5 Acres)',
    fileSize: '2.1 MB',
  },
  {
    id: 'doc-8',
    serial: 8,
    title: 'District Education Officer (DEO) Compliance & Inspection Report',
    category: 'Academic',
    referenceNo: 'DEO/CAL-SOUTH/2025/391',
    issuingAuthority: 'Office of the District Inspector of Schools (SE), Kolkata',
    validUntil: '31 Mar 2027',
    fileSize: '680 KB',
  },
];

export default function MandatoryDisclosuresTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Legal', 'Safety', 'Infrastructure', 'Health', 'Academic'];

  const filteredDocs = DISCLOSURE_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Search & Category Filter Toolbar */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificate title, gazette ID or authority..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-oxford focus:border-oxford text-slate-800"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-oxford text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP (1440px) HIGH-DENSITY SCANNABLE COMPLIANCE TABLE      */}
      {/* ============================================================ */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">S.No</th>
              <th className="py-3 px-4">Mandatory Information / Document Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Gazette / Ref No.</th>
              <th className="py-3 px-4">Issuing Authority</th>
              <th className="py-3 px-4">Validity</th>
              <th className="py-3 px-4 text-right">Verification & PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-center text-slate-500">
                  {doc.serial}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm">
                  {doc.title}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {doc.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-oxford font-semibold">
                  {doc.referenceNo}
                </td>
                <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                  {doc.issuingAuthority}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                  {doc.validUntil}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={() =>
                      alert(`Verified Document Download: ${doc.title} (${doc.fileSize}) [${doc.referenceNo}]`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-oxford hover:bg-slate-800 text-white font-bold text-[11px] transition-colors shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>View ({doc.fileSize})</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================================================ */}
      {/* MOBILE (375px) STACKED COMPLIANCE CARDS                      */}
      {/* ============================================================ */}
      <div className="lg:hidden p-4 space-y-3 divide-y divide-slate-100">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="pt-3 first:pt-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                #{doc.serial}
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {doc.category}
              </span>
            </div>

            <h4 className="font-serif font-bold text-xs text-slate-900 leading-snug">
              {doc.title}
            </h4>

            <div className="bg-slate-50 p-2.5 rounded text-[11px] space-y-1 text-slate-600 font-mono">
              <div>
                <span className="text-slate-400">Ref:</span> {doc.referenceNo}
              </div>
              <div className="line-clamp-1">
                <span className="text-slate-400">Auth:</span> {doc.issuingAuthority}
              </div>
              <div>
                <span className="text-slate-400">Validity:</span> {doc.validUntil}
              </div>
            </div>

            <button
              onClick={() =>
                alert(`Verified Document Download: ${doc.title} (${doc.fileSize}) [${doc.referenceNo}]`)
              }
              className="w-full py-2 bg-oxford text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Attested Copy ({doc.fileSize})</span>
            </button>
          </div>
        ))}
      </div>

      {/* Disclosures Footer Note */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <div>
          Official Disclosures conform strictly to Appendix IX of CBSE & CISCE Affiliation Bye-Laws.
        </div>
        <div className="font-mono text-slate-400">
          Last Annual Compliance Audit: August 2026
        </div>
      </div>
    </div>
  );
}
