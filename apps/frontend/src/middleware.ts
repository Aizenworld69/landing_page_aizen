import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

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
        try {
          const secretStr = process.env.JWT_SECRET;
          if (secretStr) {
            const secret = new TextEncoder().encode(secretStr);
            const { payload } = await jwtVerify(adminToken.value, secret);
            const role = (payload.app_metadata as { role?: string })?.role || payload.role;
            if (role === 'admin') {
              return NextResponse.redirect(new URL('/admin/tong-quan', req.url));
            }
          }
        } catch {
          // Token is invalid, let user access login page
        }
      }
      return NextResponse.next();
    }

    if (!adminToken?.value) {
      const url = new URL('/admin/dangnhap', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Verify token using jose
    try {
      const secretStr = process.env.JWT_SECRET;
      if (!secretStr) {
        throw new Error('JWT_SECRET is not configured');
      }
      const secret = new TextEncoder().encode(secretStr);
      const { payload } = await jwtVerify(adminToken.value, secret);
      const role = (payload.app_metadata as { role?: string })?.role || payload.role;
      if (role !== 'admin') {
        throw new Error('Not admin');
      }
    } catch {
      const url = new URL('/admin/dangnhap', req.url);
      url.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete('admin_token');
      return response;
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