'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import ExploreCampusesGrid from '@/components/directory/ExploreCampusesGrid';
import PortalFooter from '@/components/PortalFooter';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#101119] flex flex-col justify-between font-sans text-[#131b2e] dark:text-[#eaedff] transition-colors">
      <PublicHeader />

      <main className="flex-1 w-full">
        <ExploreCampusesGrid />
      </main>

      <PortalFooter />
    </div>
  );
}
