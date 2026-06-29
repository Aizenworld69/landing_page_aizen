import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const USER_PROTECTED = ['/my-courses'];
const ADMIN_PROTECTED = ['/admin'];
const ADMIN_PUBLIC = ['/admin/dangnhap'];

let jwksClient: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKSClient(supabaseUrl: string) {
  if (!jwksClient) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    jwksClient = createRemoteJWKSet(
      new URL(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/jwks`),
      {
        headers: anonKey ? { apikey: anonKey } : undefined,
      }
    );
  }
  return jwksClient;
}

async function verifyToken(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // 1. Thử xác thực qua JWKS (Bắt buộc cho thuật toán ES256 của Supabase mới)
  if (supabaseUrl) {
    try {
      const JWKS = getJWKSClient(supabaseUrl);
      const { payload } = await jwtVerify(token, JWKS);
      return payload;
    } catch (err) {
      console.warn('JWKS verification failed, falling back to JWT_SECRET:', err);
    }
  }

  // 2. Fallback về xác thực đối xứng bằng JWT_SECRET (dùng cho HS256/Local dev)
  const secretStr = process.env.JWT_SECRET;
  if (!secretStr) {
    throw new Error('Neither JWKS nor JWT_SECRET is configured');
  }
  const secret = new TextEncoder().encode(secretStr);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────
  if (ADMIN_PROTECTED.some((p) => pathname.startsWith(p))) {
    const adminToken = req.cookies.get('admin_token');

    // Trang đăng nhập admin
    if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
      if (adminToken?.value) {
        try {
          const payload = await verifyToken(adminToken.value);
          const role = (payload.app_metadata as { role?: string })?.role || payload.role;
          if (role === 'admin') {
            return NextResponse.redirect(new URL('/admin/tong-quan', req.url));
          }
        } catch (err) {
          console.error('Login redirect loop check error:', err);
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

    // Verify token using verifyToken helper
    try {
      const payload = await verifyToken(adminToken.value);
      const role = (payload.app_metadata as { role?: string })?.role || payload.role;
      if (role !== 'admin') {
        throw new Error(`Not admin. Role is ${role}`);
      }
    } catch (err) {
      console.error('Admin token verification error:', err);
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