import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Multi-page app: one HTML entry per screen. Every screen keeps its own
// Stitch <head> (Tailwind CDN + inline token config) byte-for-byte so the
// web rendering matches the Android app with no divergence.
const pages = [
  'index',
  'chooser',
  'email',
  'admission',
  'onboarding',
  'home',
  'academics',
  'diary',
  'notices',
  'profile',
  'helpdesk',
  'attendance',
  'bus',
  'timetable',
  'library',
  'exams',
  'canteen',
  'ptm',
  'hallpass',
  'health',
  'merits',
  'store',
  'lostfound',
  'gallery',
  'clubs',
];

const input = Object.fromEntries(
  pages.map((p) => [p, resolve(__dirname, `${p}.html`)]),
);

export default defineConfig({
  build: {
    rollupOptions: { input },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
  },
});
