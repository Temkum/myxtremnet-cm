'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AccessDeniedPage() {
  const t = useTranslations('AccessDenied');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{t('adminRequired')}</p>
            <p>{t('contactAdmin')}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('goBack')}
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/login">{t('login')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
