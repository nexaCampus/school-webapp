'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import ExploreCampusesGrid from '@/components/directory/ExploreCampusesGrid';
import PortalFooter from '@/components/PortalFooter';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-between font-sans">
      <PublicHeader />

      <main className="flex-1 w-full">
        <ExploreCampusesGrid />
      </main>

      <PortalFooter />
    </div>
  );
}
