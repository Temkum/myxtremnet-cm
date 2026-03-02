import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  // Always show locale prefix in URL: /en/... and /fr/...
  // This is predictable, SEO-friendly, and works correctly with auth redirects.
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
