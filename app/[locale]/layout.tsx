/**
 * app/[locale]/layout.tsx
 *
 * Nested layout — must NOT render <html> or <body>.
 * Only app/layout.tsx (root) does that.
 *
 * This layout is responsible for:
 * - Validating the locale param
 * - Enabling static rendering via setRequestLocale
 * - Providing translations via NextIntlClientProvider
 * - Wrapping with AuthProvider and DashboardHeader
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard/header';
import type { Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <DashboardHeader />
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
