import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/login', '/register'];

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // First run internationalization middleware
  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  // Then run authentication middleware
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthenticated = Boolean(session?.user);

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  const isAuthPage = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
