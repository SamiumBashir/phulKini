import { NextResponse } from 'next/server';
import { verifyAuthToken } from './src/lib/security/jwt.js';

const AUTH_COOKIE_NAME = 'phulkini_auth_token';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Comprehensive HTTP Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 2. Protect Admin APIs
  if (
    pathname.startsWith('/api/admin') ||
    (pathname.startsWith('/api/uploads/sign') && request.method === 'POST')
  ) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = await verifyAuthToken(token);

    if (!session || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস! অনুগ্রহ করে অ্যাডমিন হিসেবে লগইন করুন।' },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
