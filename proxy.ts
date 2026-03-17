import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const PROTECTED = ['/users', '/admin'];
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

  // user tries to access protected page but is not authenticated
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/login', request.url));

    // store original destination in a short-lived, httpOnly cookie
    response.cookies.set('redirectTo', pathname, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 5, // 5 minutes
    });

    return response;
  }

  // user tries to access login/register but is already authenticated
  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/users', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)'],
};
