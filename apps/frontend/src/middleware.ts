import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/my-courses'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isProtected = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );
  if (!isProtected) return res;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const token = req.cookies.get('access_token');
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/my-courses/:path*'],
};
