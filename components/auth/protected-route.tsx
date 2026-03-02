'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              Please sign in to access this page.
            </p>
            <Link href="/login" className="text-primary hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
