'use client';

/**
 * NexaCampus useAuth Hook
 *
 * Provides reactive session state and unified authentication actions.
 */

import { useEffect, useState, useCallback } from 'react';
import { subscribeSession, type Session } from '@/lib/state/sessionStore';
import { authService } from '@/lib/services/auth.service';

export function useAuth() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSession((latest) => {
      setSessionState(latest);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return await authService.loginWithGoogle();
  }, []);

  const loginWithAdmission = useCallback(async (admissionNumber: string) => {
    return await authService.loginWithAdmissionNumber(admissionNumber);
  }, []);

  const logout = useCallback(async (redirectTo = '/chooser') => {
    await authService.logout(redirectTo);
  }, []);

  const switchAccount = useCallback(async () => {
    await authService.switchAccount();
  }, []);

  return {
    session,
    student: session?.student || null,
    isAuthenticated: Boolean(session?.student || session?.name),
    isLoading,
    loginWithGoogle,
    loginWithAdmission,
    logout,
    switchAccount,
  };
}

export default useAuth;
