'use client';

import { useEffect, useState } from 'react';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import Toast from '@/components/Toast';

interface LostItem {
  id: string;
  title: string;
  location: string;
  icon: string;
  tag: 'Found' | 'Lost' | 'Claimed';
  accentBg: string;
  accentText: string;
}

const INITIAL_ITEMS: LostItem[] = [
  {
    id: 'lf-1',
    title: 'Black Casio Scientific Calculator (fx-991EX)',
    location: 'Room 402, 3rd Bench · Oct 02',
    icon: 'calculate',
    tag: 'Found',
    accentBg: 'bg-secondary-container/20',
    accentText: 'text-secondary',
  },
  {
    id: 'lf-2',
    title: 'Blue Milton Tiffin Box (Insulated Steel)',
    location: 'Canteen Counter 1 · Sep 30',
    icon: 'lunch_dining',
    tag: 'Found',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
  },
  {
    id: 'lf-3',
    title: 'Class 12 Physics Lab Journal (Spiral Bound)',
    location: 'Physics Lab 3 · Sep 28',
    icon: 'menu_book',
    tag: 'Found',
    accentBg: 'bg-tertiary/10',
    accentText: 'text-tertiary',
  },
  {
    id: 'lf-4',
    title: 'Black Titan Octane Wristwatch',
    location: 'Main Sports Complex · Sep 25',
    icon: 'watch',
    tag: 'Lost',
    accentBg: 'bg-error/10',
    accentText: 'text-error',
  },
];

export default function LostFoundPage() {
  const [items, setItems] = useState<LostItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formType, setFormType] = useState<'Lost' | 'Found'>('Lost');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  const handleClaim = (item: LostItem) => {
    setToastType('success');
    setToastMessage(`Claim ticket logged for "${item.title}". Verify ID at Proctor Desk Room 101.`);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter the name of the lost or found item.');
      return;
    }
    if (!formLocation.trim()) {
      setFormError('Please specify where the item was lost or found on campus.');
      return;
    }

    const newItem: LostItem = {
      id: `lf-${Date.now()}`,
      title: formTitle.trim(),
      location: `${formLocation.trim()} · Just now`,
      icon: formType === 'Lost' ? 'help_outline' : 'inventory_2',
      tag: formType,
      accentBg: formType === 'Lost' ? 'bg-error/10' : 'bg-primary/10',
      accentText: formType === 'Lost' ? 'text-error' : 'text-primary',
    };

    setItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    setFormTitle('');
    setFormLocation('');
    setFormError(null);
    setToastType('success');
    setToastMessage(`Item reported successfully! Recorded in Proctor Lost & Found register.`);
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'All') return true;
    return item.tag.toLowerCase() === filter.toLowerCase();
  });

  return (
    <PortalShell title="Lost &amp; Found" activePath="lostfound">
      <div className="flex flex-col gap-space-md">
        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Found', 'Lost', 'Claimed'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                  filter === t
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="h-[44px] px-6 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Report Item</span>
          </button>
        </div>

        {/* Responsive Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-space-xs">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-12 h-12 rounded-[14px] ${item.accentBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`material-symbols-outlined ${item.accentText} text-[24px]`}>
                    {item.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {item.tag}
                  </span>
                  <h3 className="text-[15px] font-bold text-on-surface mt-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-outline">Proctor Desk Verification</span>
                <button
                  onClick={() => handleClaim(item)}
                  className="text-[12px] font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors rounded-full px-4 py-1.5 cursor-pointer active:scale-95"
                >
                  Claim Item
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Report Item Modal */}
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Report Lost or Found Item"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white dark:bg-[#1a1c2b] rounded-3xl p-6 shadow-2xl border border-outline/15 dark:border-[#262a40] flex flex-col gap-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline/10 dark:border-[#262a40]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">assignment_turned_in</span>
                  <h3 className="text-lg font-bold text-on-surface">Report Campus Item</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-surface-container active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="flex flex-col gap-3.5">
                {formError && (
                  <div className="p-3 rounded-xl bg-error/10 text-error flex items-center gap-2 text-xs font-bold">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">Item Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormType('Lost')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        formType === 'Lost'
                          ? 'bg-error/15 border-error text-error'
                          : 'bg-surface-container-low border-transparent text-on-surface-variant'
                      }`}
                    >
                      I Lost Something
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('Found')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        formType === 'Found'
                          ? 'bg-primary/15 border-primary text-primary'
                          : 'bg-surface-container-low border-transparent text-on-surface-variant'
                      }`}
                    >
                      I Found Something
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Item Description / Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="e.g. Parker Blue Fountain Pen or Geometry Box"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Location on Campus <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => {
                      setFormLocation(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="e.g. 2nd Floor Corridor, Library Desk 4, Canteen"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 mt-2 pt-2 border-t border-outline/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Global Toast Feedback */}
        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
    </PortalShell>
  );
}
