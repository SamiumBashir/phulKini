import { NextResponse } from 'next/server';
import { authenticateUser } from '@/server/auth/authenticateUser';
import { LoginSchema } from '@/lib/validations/auth';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { AUTH_COOKIE_NAME } from '@/lib/security/auth';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const POST = withApiHandler(async (request, context, requestId) => {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';

  // Rate limit: 5 login attempts per 15 minutes per IP
  const rateLimit = await checkRateLimit(`login:${ip}`, 5, 900);
  if (!rateLimit.allowed) {
    return errorResponse(
      `অতিরিক্ত চেষ্টার কারণে লগইন সাময়িকভাবে স্থগিত। অনুগ্রহ করে ${rateLimit.resetIn} সেকেন্ড পর আবার চেষ্টা করুন।`,
      429,
      requestId
    );
  }

  const body = await request.json();
  const validation = LoginSchema.safeParse(body);

  if (!validation.success) {
    return errorResponse(
      validation.error.errors[0]?.message || 'সঠিক ইমেইল এবং পাসওয়ার্ড দিন',
      400,
      requestId
    );
  }

  const result = await authenticateUser({
    email: validation.data.email,
    password: validation.data.password,
    ip,
    userAgent
  });

  if (!result.success) {
    return errorResponse(result.message || 'লগইন ব্যর্থ হয়েছে', 401, requestId);
  }

  const response = successResponse({
    user: result.user,
    message: 'লগইন সফল হয়েছে! 🌸'
  });

  // Set secure HttpOnly cookie
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: result.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });

  return response;
}, 'AUTH_LOGIN');
