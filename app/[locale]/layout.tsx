import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { getTranslations, getMessages } from 'next-intl/server';
import { ConditionalUserHeader } from '@/components/conditional-user-header';
import { AuthProvider } from '@/lib/auth-context';
import '../globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: '' });

  return {
    title: 'Camtel - Customer Portal',
    description: t('Hero.subtitle'),
    icons: {
      icon: '/camtel.png',
      apple: '/camtel.png',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <div className="min-h-screen font-sans">
          <ConditionalUserHeader />
          {children}
          <Analytics />
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
