import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/profile', '/admin'];

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('connect.sid'); // default express-session
  const { pathname } = req.nextUrl;

  // skip jika route tidak proteksi
  if (!protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // jika session tidak ada → redirect ke login
  if (!sessionCookie) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*'],
};
