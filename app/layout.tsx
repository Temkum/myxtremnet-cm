/**
 * app/layout.tsx — Root layout
 *
 * The ONLY place <html> and <body> are rendered.
 * Sets lang dynamically from the locale detected by next-intl.
 */

import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { getLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
