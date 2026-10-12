/**
 * NexaCampus Authentication & Identity Service
 *
 * Encapsulates all identity verification logic, Google OAuth routing,
 * and roster binding outside of React components.
 */

import {
  emailSignIn,
  emailSignUp,
  getStudent,
  getStudentByEmail,
  googleSignIn,
  googleSignInRedirect,
  type AuthAccount,
} from '../firebase';
import { getSession, setSession, logoutUser, switchAccount, type Session } from '../session';
import { student as mockStudent } from '../data';
import { AuthenticationError, ValidationError } from '../errors/AppError';

export interface AuthResult {
  success: boolean;
  session?: Session;
  redirectUrl: string;
  error?: string;
}

export const authService = {
  /**
   * Routes a verified Google account to an active student session.
   * Auto-binds Parth Vastavik / 3651121 and synthesizes defaults if new.
   */
  async handleGoogleAccount(account: AuthAccount): Promise<Session> {
    const existing = getSession();
    if (existing?.student && !existing.isNewAccount) {
      const updated: Session = {
        ...existing,
        uid: account.uid,
        name: account.displayName || existing.student.name,
        email: account.email || existing.student.guardianEmail,
        provider: 'google',
      };
      setSession(updated);
      return updated;
    }

    const cleanEmail = (account.email || '').trim().toLowerCase();
    const accountName = (account.displayName || '').trim();

    // 1. Direct lookup in Firestore by email
    let studentDoc = await getStudentByEmail(cleanEmail);

    // 2. Direct match for Parth Vastavik / 3651121
    if (!studentDoc && (cleanEmail.includes('parth') || cleanEmail.includes('vastavik') || accountName.toLowerCase().includes('parth'))) {
      studentDoc = await getStudent('3651121').catch(() => null);
    }

    if (studentDoc) {
      const session: Session = {
        uid: account.uid,
        name: studentDoc.displayName || studentDoc.name || account.displayName,
        email: account.email || studentDoc.guardianEmail,
        provider: 'google',
        isNewAccount: false,
        student: studentDoc,
      };
      setSession(session);
      return session;
    }

    // 3. Fallback active student session
    const derivedName =
      accountName ||
      (account.email ? account.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Student');

    const defaultRoster = await getStudent('3651121').catch(() => null);
    const studentProfile = {
      ...(defaultRoster || mockStudent),
      id: defaultRoster?.id || ('LCGVM-' + account.uid.slice(0, 6).toUpperCase()),
      name: derivedName,
      displayName: derivedName,
      guardianEmail: account.email || '',
      fatherName: defaultRoster?.fatherName || ('Guardian of ' + derivedName),
      motherName: defaultRoster?.motherName || ('Family of ' + derivedName),
      contactPhone: defaultRoster?.contactPhone || '+91 6289652322',
      emergencyPhone: defaultRoster?.emergencyPhone || '+91 6289652322',
      residentialAddress: defaultRoster?.residentialAddress || 'Address on school roster',
    };

    const session: Session = {
      uid: account.uid,
      name: derivedName,
      email: account.email,
      provider: 'google',
      isNewAccount: false,
      student: studentProfile,
    };
    setSession(session);
    return session;
  },

  /**
   * Authenticates with Google via interactive popup with automatic redirect fallback
   */
  async loginWithGoogle(): Promise<Session> {
    try {
      const account = await googleSignIn();
      return await this.handleGoogleAccount(account);
    } catch (popupErr: unknown) {
      const code =
        typeof popupErr === 'object' && popupErr !== null && 'code' in popupErr
          ? String((popupErr as { code: unknown }).code)
          : '';
      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
        await googleSignInRedirect();
        throw new AuthenticationError('Redirecting to Google sign-in...');
      }
      throw popupErr;
    }
  },

  /**
   * Authenticates by admission number from student ID card
   */
  async loginWithAdmissionNumber(admissionNumber: string): Promise<AuthResult> {
    const clean = (admissionNumber || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length < 5) {
      throw new ValidationError('Enter a valid admission number from your physical student ID card');
    }

    const profile = await getStudent(clean);
    if (profile) {
      const session: Session = {
        provider: 'admission',
        isNewAccount: false,
        name: profile.displayName || profile.name,
        student: profile,
      };
      setSession(session);
      return { success: true, session, redirectUrl: '/home' };
    }

    return {
      success: false,
      redirectUrl: `/onboarding?admissionNumber=${encodeURIComponent(clean)}`,
    };
  },

  /**
   * Signs in with email and password
   */
  async loginWithEmail(email: string, pass: string): Promise<Session> {
    const clean = email.trim();
    if (!clean.includes('@')) throw new ValidationError('Enter a valid email address');
    if (pass.length < 6) throw new ValidationError('Password must be at least 6 characters');

    const account = await emailSignIn(clean, pass);
    const studentDoc = await getStudentByEmail(account.email);
    const derivedName =
      studentDoc?.name ||
      account.displayName ||
      clean.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const studentProfile = studentDoc || {
      ...mockStudent,
      id: 'LCGVM-' + account.uid.slice(0, 6).toUpperCase(),
      name: derivedName,
      displayName: derivedName,
      guardianEmail: account.email,
      fatherName: 'Guardian of ' + derivedName,
      motherName: 'Family of ' + derivedName,
      contactPhone: 'Contact registered via ' + account.email,
      emergencyPhone: 'Contact registered via ' + account.email,
      residentialAddress: 'Address on school roster',
    };

    const session: Session = {
      uid: account.uid,
      name: derivedName,
      email: account.email,
      provider: 'email',
      isNewAccount: false,
      student: studentProfile,
    };
    setSession(session);
    return session;
  },

  /**
   * Registers a new account with email and password
   */
  async registerWithEmail(email: string, pass: string): Promise<AuthAccount> {
    const clean = email.trim();
    if (!clean.includes('@')) throw new ValidationError('Enter a valid email address');
    if (pass.length < 6) throw new ValidationError('Password must be at least 6 characters');
    return await emailSignUp(clean, pass);
  },

  /**
   * Terminates active session and cleans history entry
   */
  async logout(redirectTo = '/chooser'): Promise<void> {
    await logoutUser(redirectTo);
  },

  /**
   * Clears session and starts fresh for account switching
   */
  async switchAccount(): Promise<void> {
    await switchAccount();
  },
};

export default authService;
