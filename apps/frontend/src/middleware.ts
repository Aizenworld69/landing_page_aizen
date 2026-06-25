import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/my-courses'];

export async function middleware(req: NextRequest) {
  const isProtected = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );
  if (!isProtected) return NextResponse.next();

  // Check custom JWT cookie
  const accessToken = req.cookies.get('access_token');

  // Check Supabase auth cookie (sb-<projectRef>-auth-token)
  const supabaseCookie = req.cookies.getAll().find(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'),
  );

  if (!accessToken && !supabaseCookie) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-courses/:path*'],
};
