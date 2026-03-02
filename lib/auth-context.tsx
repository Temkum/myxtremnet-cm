'use client';

import React, { createContext, useContext } from 'react';
import { useSession, signOut, phoneNumber } from '@/lib/auth-client';
import { useRouter } from '@/i18n/navigation'; // locale-aware router, not next/navigation

interface AuthContextType {
  user: {
    id: string;
    name: string;
    phoneNumber: string | null | undefined;
    serviceId: string | null | undefined;
  } | null;
  session: ReturnType<typeof useSession>['data'];
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useRouter from @/i18n/navigation automatically prepends the active locale.
  // router.push('/') becomes /en/ or /fr/ depending on current locale.
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        phoneNumber: (session.user as any).phoneNumber ?? null,
        serviceId: (session.user as any).serviceId ?? null,
      }
    : null;

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
    // Pushes to /en/ or /fr/ automatically — no hardcoded locale
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
