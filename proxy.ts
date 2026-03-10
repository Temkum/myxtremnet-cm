import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/login', '/register'];

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // First run internationalization middleware
  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  // Then run authentication middleware
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);
  const isAuthenticated = !!session;

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
