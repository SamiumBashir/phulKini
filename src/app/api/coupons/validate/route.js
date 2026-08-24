import { NextResponse } from 'next/server';
import { validateCoupon } from '@/server/coupons/validateCoupon';
import { CouponValidateSchema } from '@/lib/validations/coupon';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`coupon:${ip}`, 30, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'অতিরিক্ত কুপন যাচাই চেষ্টা! কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = CouponValidateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || 'ভুল তথ্য' },
        { status: 400 }
      );
    }

    const result = await validateCoupon({
      code: validation.data.code,
      orderSubtotal: validation.data.orderSubtotal
    });

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'কুপন যাচাই করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
