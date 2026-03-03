/**
 * proxy.ts — Next.js 16 middleware
 *
 * Composes next-intl locale routing with Better Auth session protection.
 *
 * Order of operations:
 * 1. Auth guard runs first on the stripped (locale-free) pathname
 * 2. next-intl middleware runs after to handle locale prefix routing
 *
 * Why auth before intl: if we let intl run first and it does a locale
 * redirect (/ → /en/), the auth guard would need to run again on the
 * redirected request. Running auth first avoids a double redirect.
 */

import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/login', '/register'];

// Matches /en, /fr, /en/, /fr/ at the start of the path
const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better Auth handlers should NOT be intercepted or redirected by this proxy.
  // This ensures /api/auth/* always works.
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Strip locale prefix to get bare path for matching
  // /en/dashboard → /dashboard
  // /fr/login     → /login
  // /dashboard    → /dashboard  (no prefix — intl will redirect)
  const strippedPathname = pathname.replace(localePattern, '/');

  // Detect active locale from URL, fall back to default
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Better Auth sets the cookie as "better-auth.session_token" by default.
  // getSessionCookie reads it without a DB call — fast edge-compatible check.
  const session = getSessionCookie(request);
  const isAuthenticated = !!session;

  // Redirect unauthenticated users away from protected routes
  if (
    PROTECTED.some((p) => strippedPathname.startsWith(p)) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    // Preserve the full original path so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth-only routes
  if (
    AUTH_ONLY.some((p) => strippedPathname.startsWith(p)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Let next-intl handle locale detection, prefix redirects, and cookie setting
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match everything except:
    // - /api/* routes (Better Auth handlers live here)
    // - /_next/* (Next.js internals)
    // - Static files with extensions (images, fonts, etc.)
    '/((?!api|_next|.*\\..*).*)',
  ],
};
