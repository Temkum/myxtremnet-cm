import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/login', '/register'];

export async function proxy(request: NextRequest) {
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
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
