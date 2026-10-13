'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import FacultyDirectory from '@/components/public/FacultyDirectory';
import PortalFooter from '@/components/PortalFooter';

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-between font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <FacultyDirectory />
      </main>

      <PortalFooter />
    </div>
  );
}
