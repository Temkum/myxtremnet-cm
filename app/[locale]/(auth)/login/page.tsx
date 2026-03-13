'use client';

import { Suspense } from 'react';
import { LoginComponent } from './LoginComponent';
import { Footer } from '@/components/footer';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            {t('loading')}
          </div>
        }
      >
        <LoginComponent />
      </Suspense>

      <Footer />
    </>
  );
}
