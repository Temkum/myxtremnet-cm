import { usePathname } from '@/i18n/navigation'; // returns path WITHOUT locale prefix

/**
 * hooks/use-active-path.ts
 *
 * usePathname from @/i18n/navigation returns the pathname WITHOUT the locale
 * prefix. So on /en/dashboard it returns /dashboard, on /fr/dashboard it also
 * returns /dashboard. This means checkActive('/dashboard') works correctly
 * for both locales.
 *
 * If you use usePathname from next/navigation instead, you get /en/dashboard
 * and the comparison against /dashboard always fails.
 */
export function useActivePath() {
  const pathname = usePathname();

  const checkActive = (href: string) => {
    // Exact match for top-level dashboard to avoid /dashboard matching /dashboard/bundles
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return { checkActive, pathname };
}
