// Firebase access for the web twin. Same contract as the Android
// FirebaseAdmissionAuthRepository: anonymous session + students/{id} docs.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth, type User } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, type Firestore } from 'firebase/firestore';
import type { Student } from './data';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let cached: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

export function firebase() {
  if (!cached) {
    const app = initializeApp(config);
    cached = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return cached;
}

export function normalizeAdmissionNumber(raw: string): string {
  return (raw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export async function ensureAnonymous(): Promise<User> {
  const { auth } = firebase();
  if (!auth.currentUser) await signInAnonymously(auth);
  if (!auth.currentUser) throw new Error('Could not establish a school session. Try again.');
  return auth.currentUser;
}

/** Returns the roster profile or null when the admission number is unknown. */
export async function getStudent(admissionNumber: string): Promise<(Student & { id: string }) | null> {
  const normalized = normalizeAdmissionNumber(admissionNumber);
  if (!normalized) throw new Error('Please enter your admission number');
  await ensureAnonymous();
  const { db } = firebase();
  const snap = await getDoc(doc(db, 'students', normalized));
  if (!snap.exists()) return null;
  const { id: _docId, ...data } = snap.data() as Student;
  return { id: snap.id, ...data };
}

/** Merge-writes the onboarding profile. Never overwrites office-filled fields. */
export async function saveStudent(profile: Student & { id: string }): Promise<Student & { id: string }> {
  const normalized = normalizeAdmissionNumber(profile.id);
  if (!normalized) throw new Error('Admission number is required');
  await ensureAnonymous();
  const { db } = firebase();
  const record = { ...profile, id: normalized };
  await setDoc(doc(db, 'students', normalized), record, { merge: true });
  return record;
}
