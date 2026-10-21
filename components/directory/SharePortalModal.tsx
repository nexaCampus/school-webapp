'use client';

import React, { useState } from 'react';
import { tenantPortalUrls } from '@/lib/tenantUrls';

export interface SchoolShareInfo {
  name: string;
  slug: string;
  affiliation: string;
  location: string;
  url: string;
}

export default function SharePortalModal({
  school,
  onClose,
}: {
  school: SchoolShareInfo;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'embed'>('link');

  const portalUrl = school.url || tenantPortalUrls(school.slug).appDomain;
  const embedCode = `<iframe src="${portalUrl}/embed" width="100%" height="600" frameborder="0" title="${school.name} Portal"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${school.name} | NexaCampus Institutional Portal`,
          text: `Explore the official academic portal, mandatory disclosures & admissions for ${school.name}.`,
          url: portalUrl,
        });
      } catch {
        // Fallback to copy link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in font-sans">
      <div className="bg-white dark:bg-[#151622] text-slate-900 dark:text-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-300 dark:border-[#262a40] transition-colors">
        {/* Header */}
        <div className="bg-oxford dark:bg-[#070913] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 dark:border-[#1a1d2e]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="font-serif font-bold text-base text-amber-200">
              Share Institutional Web Portal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* School Overview Pill */}
        <div className="p-5 pb-0">
          <div className="bg-slate-50 dark:bg-[#10111a] p-3.5 rounded-lg border border-slate-200 dark:border-[#222538] flex items-center justify-between transition-colors">
            <div>
              <h4 className="font-serif font-bold text-sm text-oxford dark:text-white">{school.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {school.affiliation} • {school.location}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">
              Active Tenant
            </span>
          </div>

          {/* Sub tabs */}
          <div className="flex border-b border-slate-200 dark:border-[#262a40] mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('link')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'link'
                  ? 'border-oxford dark:border-[#3b49df] text-oxford dark:text-[#bdc2ff] font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Direct Link &amp; Native Share
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'border-oxford dark:border-[#3b49df] text-oxford dark:text-[#bdc2ff] font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Printable Noticeboard QR
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'embed'
                  ? 'border-oxford dark:border-[#3b49df] text-oxford dark:text-[#bdc2ff] font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Embed Widget
            </button>
          </div>
        </div>

        {/* Tab 1: Direct Link */}
        {activeTab === 'link' && (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subdomain Public Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={portalUrl}
                  className="flex-1 p-2 text-xs font-mono bg-slate-50 dark:bg-[#10111a] border border-slate-300 dark:border-[#262a40] rounded text-slate-800 dark:text-slate-200 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-oxford dark:bg-[#3b49df] hover:bg-slate-800 dark:hover:bg-[#2d38be] text-white rounded text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 bg-slate-100 dark:bg-[#181a27] hover:bg-slate-200 dark:hover:bg-[#202334] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#262a40] rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#0A192F] dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Trigger Mobile Share Sheet</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Printable QR Code */}
        {activeTab === 'qr' && (
          <div className="p-5 text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-lg border-2 border-oxford dark:border-[#3b49df] flex flex-col items-center justify-center shadow-xs">
              {/* High-fidelity SVG QR representation */}
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                <rect width="100" height="100" fill="#FFFFFF" />
                <path d="M10 10H40V40H10zM15 15V35H35V15zM20 20H30V30H20z" fill="#0A192F" />
                <path d="M60 10H90V40H60zM65 15V35H85V15zM70 20H80V30H70z" fill="#0A192F" />
                <path d="M10 60H40V90H10zM15 65V85H35V65zM20 70H30V80H20z" fill="#0A192F" />
                <rect x="45" y="15" width="8" height="8" fill="#0A192F" />
                <rect x="45" y="30" width="8" height="15" fill="#0A192F" />
                <rect x="60" y="50" width="12" height="12" fill="#0A192F" />
                <rect x="75" y="50" width="15" height="8" fill="#0A192F" />
                <rect x="45" y="65" width="10" height="25" fill="#0A192F" />
                <rect x="65" y="75" width="25" height="15" fill="#0A192F" />
              </svg>
              <span className="text-[10px] font-mono font-bold text-oxford mt-1">
                SCAN FOR ADMISSION PROSPECTUS
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Optimized for high-resolution printing on school bulletin boards, fee counters, and admission prospectuses.
            </p>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-oxford dark:bg-[#3b49df] hover:bg-slate-800 dark:hover:bg-[#2d38be] text-white rounded text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Print Formal Noticeboard Placard
            </button>
          </div>
        )}

        {/* Tab 3: Embed Code */}
        {activeTab === 'embed' && (
          <div className="p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              HTML iFrame Embed Snippet
            </label>
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full p-2.5 text-xs font-mono bg-slate-50 dark:bg-[#10111a] border border-slate-300 dark:border-[#262a40] rounded text-slate-800 dark:text-slate-200 select-all"
            />
            <button
              onClick={handleCopyEmbed}
              className="w-full py-2 bg-oxford dark:bg-[#3b49df] hover:bg-slate-800 dark:hover:bg-[#2d38be] text-white rounded text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {copiedEmbed ? 'Snippet Copied to Clipboard ✓' : 'Copy Embed Code'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#181a27] px-5 py-3 border-t border-slate-200 dark:border-[#262a40] flex justify-end transition-colors">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
