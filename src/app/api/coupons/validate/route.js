import { validateCoupon } from '@/server/coupons/validateCoupon';
import { CouponValidateSchema } from '@/lib/validations/coupon';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const POST = withApiHandler(async (request, context, requestId) => {
  const body = await request.json();
  const validation = CouponValidateSchema.safeParse(body);

  if (!validation.success) {
    return errorResponse(
      validation.error.errors[0]?.message || 'কুপন কোড ও সাবটোটাল আবশ্যক',
      400,
      requestId
    );
  }

  const result = await validateCoupon({
    code: validation.data.code,
    orderSubtotal: validation.data.orderSubtotal
  });

  return successResponse({
    ...result
  });
}, 'COUPON_VALIDATE');
