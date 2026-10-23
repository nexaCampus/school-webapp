/**
 * Generates public/firebase-messaging-sw.js from
 * public/firebase-messaging-sw.template.js + environment values.
 *
 * Runs automatically before `next dev` and `next build` (predev / prebuild).
 * Reads NEXT_PUBLIC_FIREBASE_* from process.env first, then falls back to
 * parsing .env.local / .env so local runs work without extra tooling.
 *
 * The generated file is git-ignored: no Firebase key is ever committed.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = join(repoRoot, 'public', 'firebase-messaging-sw.template.js');
const outputPath = join(repoRoot, 'public', 'firebase-messaging-sw.js');

function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const filePath = join(repoRoot, file);
    if (!existsSync(filePath)) continue;
    for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if ((key.startsWith('NEXT_PUBLIC_') || key.startsWith('SESSION_')) && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFiles();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

if (!firebaseConfig.apiKey) {
  console.warn('[FCM] NEXT_PUBLIC_FIREBASE_API_KEY is not set - the service worker will be generated without a usable Firebase config (background push disabled).');
}

const template = readFileSync(templatePath, 'utf8');
const generated = template.replace(/__FIREBASE_CONFIG_JSON__/g, JSON.stringify(firebaseConfig, null, 2));
writeFileSync(outputPath, generated);
console.log('[FCM] generated public/firebase-messaging-sw.js');
