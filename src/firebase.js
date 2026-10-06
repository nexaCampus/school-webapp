// Firebase access for the web twin. Same contract as the Android
// FirebaseAdmissionAuthRepository: anonymous session + students/{id} docs.
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let cached = null;

export function firebase() {
  if (!cached) {
    const app = initializeApp(config);
    cached = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return cached;
}

export function normalizeAdmissionNumber(raw) {
  return (raw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export async function ensureAnonymous() {
  const { auth } = firebase();
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser;
}

/** Returns the roster profile or null when the admission number is unknown. */
export async function getStudent(admissionNumber) {
  const normalized = normalizeAdmissionNumber(admissionNumber);
  if (!normalized) throw new Error('Please enter your admission number');
  await ensureAnonymous();
  const { db } = firebase();
  const snap = await getDoc(doc(db, 'students', normalized));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Merge-writes the onboarding profile. Never overwrites office-filled fields. */
export async function saveStudent(profile) {
  const normalized = normalizeAdmissionNumber(profile.id);
  if (!normalized) throw new Error('Admission number is required');
  await ensureAnonymous();
  const { db } = firebase();
  const record = { ...profile, id: normalized };
  await setDoc(doc(db, 'students', normalized), record, { merge: true });
  return record;
}
