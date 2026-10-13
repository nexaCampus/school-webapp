'use client';

import React from 'react';

export interface FilterState {
  board: string;
  state: string;
  type: string;
  feeRange: string;
}

export default function DirectoryFilterDrawer({
  filters,
  onChange,
  onReset,
  mobileOpen,
  onCloseMobile,
}: {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const boards = ['All Boards', 'CBSE', 'ICSE', 'Cambridge', 'State Board'];
  const states = ['All States', 'West Bengal', 'Delhi NCR', 'Karnataka', 'Maharashtra'];
  const types = ['All Types', 'Co-ed', 'Day Boarding', 'Girls', 'Boys'];
  const feeRanges = ['All Budgets', '< ₹1.0L / yr', '₹1.0L - ₹1.5L / yr', '> ₹1.5L / yr'];

  const filterContent = (
    <div className="space-y-6 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <span className="font-serif font-bold text-sm text-oxford uppercase tracking-wide">
          Filter Campuses
        </span>
        <button
          onClick={onReset}
          className="text-amber-700 hover:text-amber-800 font-semibold underline"
        >
          Reset All
        </button>
      </div>

      {/* Board Filter */}
      <div>
        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono text-[10px]">
          Affiliation Board
        </label>
        <div className="space-y-1.5">
          {boards.map((b) => (
            <label
              key={b}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                filters.board === b ? 'bg-oxford text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="board"
                checked={filters.board === b}
                onChange={() => onChange('board', b)}
                className="hidden"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* State / Region */}
      <div>
        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono text-[10px]">
          State / Territory
        </label>
        <div className="space-y-1.5">
          {states.map((s) => (
            <label
              key={s}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                filters.state === s ? 'bg-oxford text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="state"
                checked={filters.state === s}
                onChange={() => onChange('state', s)}
                className="hidden"
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Institution Type */}
      <div>
        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono text-[10px]">
          Institution Model
        </label>
        <div className="space-y-1.5">
          {types.map((t) => (
            <label
              key={t}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                filters.type === t ? 'bg-oxford text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="type"
                checked={filters.type === t}
                onChange={() => onChange('type', t)}
                className="hidden"
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Annual Fee Budget */}
      <div>
        <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono text-[10px]">
          Annual Fee Band
        </label>
        <div className="space-y-1.5">
          {feeRanges.map((f) => (
            <label
              key={f}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                filters.feeRange === f ? 'bg-oxford text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="feeRange"
                checked={filters.feeRange === f}
                onChange={() => onChange('feeRange', f)}
                className="hidden"
              />
              <span>{f}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Facet Sidebar */}
      <div className="hidden lg:block bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit sticky top-24">
        {filterContent}
      </div>

      {/* Mobile Bottom-Sheet Filter Modal */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="font-serif font-bold text-base text-oxford">
                Filter Institutional Directory
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {filterContent}

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 bg-oxford text-white rounded text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
