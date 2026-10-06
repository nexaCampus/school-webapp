'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

const BOOKS = [
  {
    title: 'Concepts of Physics (Vol 1 & 2)',
    author: 'Dr. H. C. Verma',
    accNo: 'ACC-PHY-8842',
    category: 'Textbooks',
    available: '3 of 8 available',
    color: 'text-tertiary',
  },
  {
    title: 'Clean Code: Agile Software',
    author: 'Robert C. Martin',
    accNo: 'ACC-CS-2041',
    category: 'Computer Science',
    available: '1 of 4 available',
    color: 'text-tertiary',
  },
  {
    title: 'Higher Algebra & Calculus Methods',
    author: 'Hall & Knight',
    accNo: 'ACC-MTH-9021',
    category: 'Textbooks',
    available: '4 of 5 available',
    color: 'text-tertiary',
  },
  {
    title: 'Organic Chemistry Structure & Mechanism',
    author: 'Morrison & Boyd',
    accNo: 'ACC-CHM-7714',
    category: 'Reference',
    available: '2 of 6 available',
    color: 'text-tertiary',
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    accNo: 'ACC-SCI-1102',
    category: 'Popular Science',
    available: '5 of 5 available',
    color: 'text-tertiary',
  },
  {
    title: 'Artificial Intelligence: Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    accNo: 'ACC-CS-9912',
    category: 'Computer Science',
    available: '2 of 3 available',
    color: 'text-tertiary',
  },
];

export default function LibraryPage() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  const filtered = BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PortalShell title="Digital Library" activePath="library">
      <div className="flex flex-col gap-space-md">
        {/* Search Bar */}
        <label className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl px-4 py-3.5 shadow-sm border border-outline/10 focus-within:ring-2 focus-within:ring-primary">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by book title, author, or accession code..."
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium text-on-surface placeholder:text-outline"
          />
        </label>

        {/* Books Responsive Grid: 1 on mobile, 2 on tablet, 3 on laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-space-xs">
          {filtered.map((b, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-[20px] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-[11px] font-bold text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                  {b.category}
                </span>
                <h3 className="text-[16px] font-bold text-on-surface mt-2 leading-snug">
                  {b.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {b.author} · {b.accNo}
                </p>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline/10">
                <span className={`text-[12px] font-bold ${b.color}`}>{b.available}</span>
                <button className="text-[12px] font-bold text-white bg-primary hover:bg-primary/90 transition-colors rounded-full px-4 py-1.5 shadow-sm">
                  Reserve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
