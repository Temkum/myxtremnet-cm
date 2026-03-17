'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AccessDeniedPage from './AccessDeniedPage';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AdminRoute({
  children,
  redirectTo = '/access-denied',
}: AdminRouteProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin && user !== null) {
      // User is authenticated but not admin, redirect to access denied
      router.push(redirectTo);
    }
  }, [isAdmin, user, router, redirectTo]);

  // While checking authentication, show nothing to prevent flicker
  if (user === null) {
    return null;
  }

  // If not admin, show access denied page (will be redirected by useEffect)
  if (!isAdmin) {
    return <AccessDeniedPage />;
  }

  // User is admin, render children
  return <>{children}</>;
}
