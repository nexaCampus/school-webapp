'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import TenantCmsPreview from '@/components/onboarding/TenantCmsPreview';
import PortalFooter from '@/components/PortalFooter';

export default function AdminCmsPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-between font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        <TenantCmsPreview />
      </main>

      <PortalFooter />
    </div>
  );
}
