import { NextResponse } from 'next/server';
import { authenticateUser } from '@/server/auth/authenticateUser';
import { LoginSchema } from '@/lib/validations/auth';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { AUTH_COOKIE_NAME } from '@/lib/security/auth';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Rate limit: 5 login attempts per 15 minutes per IP
    const rateLimit = await checkRateLimit(`login:${ip}`, 10, 900);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `অতিরিক্ত চেষ্টার কারণে লগইন সাময়িকভাবে স্থগিত। অনুগ্রহ করে ${rateLimit.resetIn} সেকেন্ড পর চেষ্টা করুন।`
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || 'সঠিক তথ্য দিন' },
        { status: 400 }
      );
    }

    const result = await authenticateUser({
      email: validation.data.email,
      password: validation.data.password,
      ip,
      userAgent
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
