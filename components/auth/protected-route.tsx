'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const t = useTranslations('Restricted');

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {t('accessRestricted')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('signInText')}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild className="w-full" size="lg">
                <Link href="/login">{t('signIn')}</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">{t('backToHome')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}
