/**
 * app/layout.tsx — Root layout
 *
 * The ONLY place <html> and <body> are rendered.
 * Sets lang dynamically from the locale detected by next-intl.
 *
 * All providers (NextIntlClientProvider, AuthProvider) live in
 * app/[locale]/layout.tsx — not here.
 */

import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { getLocale } from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'Camtel - Customer Portal',
  description:
    'Manage your Camtel X-tremNet internet services - account, billing, and support',
  icons: {
    icon: '/camtel.png',
    apple: '/camtel.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reads the locale from the request (set by next-intl middleware)
  // so <html lang="fr"> is correct for French users server-side
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
