'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';

interface AdminGuardProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function AdminGuard({
  children,
  fallbackMessage,
}: AdminGuardProps) {
  const { isAdmin } = useAuth();
  const t = useTranslations('Admin');

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('accessRestricted')}
          </h1>
          <p className="text-muted-foreground">
            {fallbackMessage || t('noPermissionAdmin')}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
