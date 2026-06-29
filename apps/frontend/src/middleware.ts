import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_PROTECTED = ['/my-courses'];
const ADMIN_PROTECTED = ['/admin'];
const ADMIN_PUBLIC = ['/admin/dangnhap'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────
  if (ADMIN_PROTECTED.some((p) => pathname.startsWith(p))) {
    const adminToken = req.cookies.get('admin_token');

    // Trang đăng nhập admin
    if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
      if (adminToken?.value) {
        return NextResponse.redirect(new URL('/admin/tong-quan', req.url));
      }
      return NextResponse.next();
    }

    if (!adminToken?.value) {
      const url = new URL('/admin/dangnhap', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── User routes ───────────────────────────────
  const isProtected = USER_PROTECTED.some((p) => pathname.startsWith(p));
  const accessToken = req.cookies.get('access_token');
  const supabaseCookie = req.cookies.getAll().find(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'),
  );
  const hasAuth = !!(accessToken || supabaseCookie);

  // Nếu đã đăng nhập mà cố vào trang login/register của user
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && hasAuth) {
    return NextResponse.redirect(new URL('/my-courses', req.url));
  }

  if (isProtected && !hasAuth) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/my-courses/:path*', '/admin/:path*', '/auth/login', '/auth/register'],
};