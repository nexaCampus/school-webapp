import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NexaCampus - Lions Calcutta Greater Vidya Mandir',
    short_name: 'NexaCampus',
    description:
      'Official Student & Guardian Academic Portal — Lions Calcutta Greater Vidya Mandir (LCGVM • CISCE)',
    start_url: '/?source=pwa',
    scope: '/',
    id: '/?source=pwa',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#1e1e1e',
    theme_color: '#1c2ac8',
    icons: [
      {
        src: '/icons/icon-lite.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
