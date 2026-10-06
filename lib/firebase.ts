// Firebase access for the web twin. Same contract as the Android
// FirebaseAdmissionAuthRepository: anonymous session + students/{id} docs.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getAuth,
  sendEmailVerification,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User,
  type UserCredential,
} from 'firebase/auth';
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

// ---------------------------------------------------------------------------
// Firebase Authentication (email/password + Google). Replaces Clerk on web:
// sign-in state doubles as the roster read/write session, so no anonymous
// hop is needed once the user authenticates.
// ---------------------------------------------------------------------------

export interface AuthAccount {
  uid: string;
  displayName: string;
  email: string;
  isNewAccount: boolean;
}

function accountOf(user: User, isNewAccount: boolean): AuthAccount {
  return {
    uid: user.uid,
    displayName: user.displayName?.trim() || '',
    email: user.email?.trim() || '',
    isNewAccount,
  };
}

/** Email + password sign-in. Always an existing account. */
export async function emailSignIn(email: string, password: string): Promise<AuthAccount> {
  const { auth } = firebase();
  const credential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  return accountOf(credential.user, false);
}

/**
 * Email + password registration. Firebase verifies email via link (there is
 * no in-app code step), so a verification mail is sent fire-and-forget and
 * the new account proceeds straight to onboarding.
 */
export async function emailSignUp(email: string, password: string): Promise<AuthAccount> {
  const { auth } = firebase();
  const credential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  try {
    await sendEmailVerification(credential.user);
  } catch {
    // Non-fatal: the account exists and onboarding still proceeds.
  }
  return accountOf(credential.user, true);
}

/**
 * Google sign-in in a popup. getAdditionalUserInfo reports whether the
 * Google identity just created its Firebase account (new → onboarding).
 */
export async function googleSignIn(): Promise<AuthAccount> {
  const { auth } = firebase();
  const credential: UserCredential = await signInWithPopup(auth, new GoogleAuthProvider());
  const isNewAccount = getAdditionalUserInfo(credential)?.isNewUser ?? false;
  return accountOf(credential.user, isNewAccount);
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(firebase().auth);
}

/** Firebase error codes → the red-block message. Never leaks internals. */
export function friendlyAuthError(error: unknown, mode: 'signin' | 'signup'): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return mode === 'signin'
        ? 'No matching email/password found. Switch to Create account if this email was never registered.'
        : 'Could not create the account with these details. Try again.';
    case 'auth/email-already-in-use':
      return 'This email already has an account. Switch to Sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters. Choose a stronger one.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'The Google window was closed before finishing. Try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one Google window at a time — finish it and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is switched off in Firebase Console → Authentication → Sign-in method.';
    case 'auth/unauthorized-domain':
      return (
        'This website address is not allowlisted in Firebase Console → ' +
        'Authentication → Settings → Authorized domains. Add this exact origin: ' +
        (typeof window !== 'undefined' ? window.location.origin : '(this site)')
      );
    case 'auth/network-request-failed':
      return 'Could not reach the sign-in service. Check your connection and try again.';
    default:
      return error instanceof Error && error.message
        ? error.message
        : 'Something went wrong. Try again.';
  }
}
