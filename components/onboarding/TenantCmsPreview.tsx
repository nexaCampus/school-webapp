'use client';

import React, { useState } from 'react';

interface CmsNotice {
  id: string;
  refId: string;
  title: string;
  audience: string;
  category: string;
  date: string;
  published: boolean;
}

interface BlockItem {
  id: string;
  title: string;
  desc: string;
  enabled: boolean;
  order: number;
}

interface AdmissionLead {
  id: string;
  candidateName: string;
  grade: string;
  parentPhone: string;
  date: string;
  status: 'Pending Verification' | 'Document Approved' | 'Interview Allotted' | 'Enrolled';
  scorePercent: string;
}

const INITIAL_NOTICES: CmsNotice[] = [
  {
    id: 'cms-n-1',
    refId: 'SCV/CIR/2026/01',
    title: 'Autumn Break Schedule & Examination Hall Guidelines',
    audience: 'All Students & Parents',
    category: 'Examination',
    date: '12 Oct 2026',
    published: true,
  },
  {
    id: 'cms-n-2',
    refId: 'SCV/CIR/2026/02',
    title: 'Registration Open for Inter-School Debate & Model UN 2026',
    audience: 'Classes IX to XII',
    category: 'Academic',
    date: '10 Oct 2026',
    published: true,
  },
];

const INITIAL_BLOCKS: BlockItem[] = [
  { id: 'b-hero', title: 'Hero Carousel & Fast-Track Hub', desc: 'Main campus banners & quick admission triggers', enabled: true, order: 1 },
  { id: 'b-ticker', title: 'Marquee Circular Ticker', desc: 'Real-time official gazette announcement ticker', enabled: true, order: 2 },
  { id: 'b-facts', title: 'Quick Facts & Benchmarks Bar', desc: 'Student-teacher ratio, acreage, and labs', enabled: true, order: 3 },
  { id: 'b-seal', title: "Principal's Desk & Verified Seal", desc: 'Executive address and authentic cryptographic stamp', enabled: true, order: 4 },
  { id: 'b-calendar', title: 'Academic Calendar & Term Dates', desc: 'Filterable events, holidays, and exam schedule', enabled: true, order: 5 },
  { id: 'b-transit', title: 'Transit & Bus Route Directory', desc: 'Interactive route stops and GPS supervisor details', enabled: true, order: 6 },
];

const INITIAL_LEADS: AdmissionLead[] = [
  { id: 'LD-901', candidateName: 'Aarav Mukherjee', grade: 'Class I', parentPhone: '+91 98301-44102', date: '12 Oct 2026', status: 'Interview Allotted', scorePercent: '96%' },
  { id: 'LD-902', candidateName: 'Debasmita Roy', grade: 'Class VI', parentPhone: '+91 98311-22910', date: '11 Oct 2026', status: 'Document Approved', scorePercent: '92%' },
  { id: 'LD-903', candidateName: 'Sohan Sengupta', grade: 'Class XI (Sci)', parentPhone: '+91 98304-88319', date: '10 Oct 2026', status: 'Pending Verification', scorePercent: '88%' },
  { id: 'LD-904', candidateName: 'Priya Sen', grade: 'Nursery', parentPhone: '+91 98322-11400', date: '09 Oct 2026', status: 'Enrolled', scorePercent: 'N/A' },
];

export default function TenantCmsPreview() {
  const [activeTab, setActiveTab] = useState<'notices' | 'blocks' | 'leads'>('notices');

  // Notices state
  const [notices, setNotices] = useState<CmsNotice[]>(INITIAL_NOTICES);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeRef, setNewNoticeRef] = useState('');
  const [newNoticeAudience, setNewNoticeAudience] = useState('All Students');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Academic');

  // Blocks state
  const [blocks, setBlocks] = useState<BlockItem[]>(INITIAL_BLOCKS);

  // Leads state
  const [leads, setLeads] = useState<AdmissionLead[]>(INITIAL_LEADS);
  const [leadFilter, setLeadFilter] = useState('All');

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;

    const notice: CmsNotice = {
      id: `cms-n-${Date.now()}`,
      refId: newNoticeRef || `SCV/CIR/2026/${Math.floor(10 + Math.random() * 90)}`,
      title: newNoticeTitle,
      audience: newNoticeAudience,
      category: newNoticeCategory,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      published: true,
    };

    setNotices([notice, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeRef('');
  };

  const handleToggleBlock = (id: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const filteredLeads =
    leadFilter === 'All' ? leads : leads.filter((l) => l.status === leadFilter);

  const exportLeadsCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Docket ID,Candidate Name,Grade,Parent Phone,Score,Date,Status']
        .concat(
          leads.map(
            (l) =>
              `${l.id},"${l.candidateName}",${l.grade},${l.parentPhone},${l.scorePercent},${l.date},${l.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'admissions_leads_session_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* CMS Admin Top Bar */}
      <div className="bg-oxford text-white p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-widest">
              Tenant CMS & Institutional Console
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-white mt-1">
            Saraswati Centennial Vidyapeeth • Admin
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            Tenant ID: scv • CBSE-REG-1930492 • Live Production Session
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'notices'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Circulars & Notices
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'blocks'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Homepage Block Order
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'leads'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Admission Leads ({leads.length})
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* ============================================================ */}
        {/* TAB 1: LIVE NOTICE UPLOADER & PUBLISHING CONSOLE             */}
        {/* ============================================================ */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-serif font-bold text-base text-oxford mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Publish Official Circular to Public Web Portal</span>
              </h3>

              <form onSubmit={handleAddNotice} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-5">
                  <label className="block font-bold text-slate-700 mb-1">
                    Notice Headline / Circular Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g. Schedule for Pre-Board Practical Examinations"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-oxford text-slate-900"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    Gazette / Reference Code
                  </label>
                  <input
                    type="text"
                    value={newNoticeRef}
                    onChange={(e) => setNewNoticeRef(e.target.value)}
                    placeholder="e.g. SCV/CIR/2026/04"
                    className="w-full p-2.5 bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#2b2f48] rounded font-mono text-slate-900 dark:text-[#eaedff]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-[#c4c7e0] mb-1">
                    Category
                  </label>
                  <select
                    aria-label="Notice category"
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#2b2f48] rounded text-slate-800 dark:text-[#dfe2f4]"
                  >
                    <option>Examination</option>
                    <option>Academic</option>
                    <option>Urgent</option>
                    <option>Administrative</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-oxford hover:bg-slate-800 text-white font-bold rounded shadow-xs transition-colors"
                  >
                    Promulgate Notice
                  </button>
                </div>
              </form>
            </div>

            {/* List of Published Notices */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 flex justify-between">
                <span>Currently Live Institutional Circulars</span>
                <span>{notices.length} Promulgated</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {notices.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {n.refId}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                          {n.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Published: {n.date}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-oxford">
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Audience: {n.audience}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        ● Publicly Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: HOMEPAGE BLOCK REORDERING & SECTION TOGGLE            */}
        {/* ============================================================ */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600">
              Drag or use arrows to reorder content sections appearing on your school homepage. Toggle sections off to hide them during vacations or revisions.
            </div>

            <div className="space-y-2.5">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`p-4 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                    block.enabled
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-100 text-oxford font-mono font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-slate-900">
                        {block.title}
                      </div>
                      <div className="text-xs text-slate-500">{block.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handleToggleBlock(block.id)}
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        block.enabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {block.enabled ? 'Enabled' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ADMISSION LEADS & REGISTRATION MERIT EXPORT           */}
        {/* ============================================================ */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-[#c4c7e0]">Filter Status:</span>
                <select
                  aria-label="Filter leads"
                  value={leadFilter}
                  onChange={(e) => setLeadFilter(e.target.value)}
                  className="p-1.5 text-xs bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#2b2f48] rounded text-slate-800 dark:text-[#dfe2f4]"
                >
                  <option>All</option>
                  <option>Interview Allotted</option>
                  <option>Document Approved</option>
                  <option>Pending Verification</option>
                  <option>Enrolled</option>
                </select>
              </div>

              <button
                onClick={exportLeadsCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-oxford hover:bg-slate-800 text-white rounded text-xs font-bold shadow-xs transition-colors"
              >
                <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Leads as CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Docket ID</th>
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Prior Score</th>
                    <th className="py-2.5 px-3">Guardian Mobile</th>
                    <th className="py-2.5 px-3">Submission Date</th>
                    <th className="py-2.5 px-3">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-oxford">
                        {lead.id}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {lead.candidateName}
                      </td>
                      <td className="py-3 px-3">{lead.grade}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {lead.scorePercent}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {lead.parentPhone}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{lead.date}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.status === 'Enrolled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'Interview Allotted'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
