'use client';

/**
 * lib/auth-context.tsx
 *
 * Replaces the old JWT-based context with Better Auth session management.
 * useSession() from Better Auth handles polling/revalidation automatically.
 *
 * The old manual fetch to /api/auth/get-session, login, register, and logout
 * are replaced by the Better Auth client methods.
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useSession, signOut, phoneNumber } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: {
    id: string;
    name: string;
    phoneNumber: string | null | undefined;
    serviceId: string | null | undefined;
    role: 'user' | 'admin';
    email: string | null | undefined;
  } | null;
  session: ReturnType<typeof useSession>['data'];
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        // These fields come from the phoneNumber plugin & your custom schema
        phoneNumber: (session.user as any).phoneNumber ?? null,
        serviceId: (session.user as any).serviceId ?? null,
        role: (session.user as any).role ?? 'user',
        email: session.user.email ?? null,
      }
    : null;

  const isAdmin = user?.role === 'admin';

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user && isAdmin && !isPending) {
      // Check if current path is not already admin
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin')) {
        router.push('/admin');
      }
    }
  }, [user, isAdmin, isPending, router]);

  const sendOtp = async (phone: string): Promise<{ error?: string }> => {
    const { error } = await phoneNumber.sendOtp({ phoneNumber: phone });
    if (error) return { error: error.message };
    return {};
  };

  const verifyOtp = async (
    phone: string,
    code: string,
  ): Promise<{ error?: string }> => {
    const { error } = await phoneNumber.verify({ phoneNumber: phone, code });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading: isPending,
        sendOtp,
        verifyOtp,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
