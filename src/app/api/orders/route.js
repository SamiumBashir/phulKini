import { NextResponse } from 'next/server';
import { createOrder } from '@/server/orders/createOrder';
import { getOrders } from '@/server/orders/getOrders';
import { getServerSession, requireRole } from '@/lib/security/auth';
import { OrderCreateSchema } from '@/lib/validations/order';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { initSSLCommerzPayment } from '@/server/payments/sslcommerz';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';
import { ENV } from '@/lib/config/env';

export const POST = withApiHandler(async (request, context, requestId) => {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';
  const idempotencyKey = request.headers.get('idempotency-key') || null;

  // Rate limit: max 10 orders per minute per IP
  const rateLimit = await checkRateLimit(`order_create:${ip}`, 10, 60);
  if (!rateLimit.allowed) {
    return errorResponse(
      'অতিরিক্ত অর্ডার অনুরোধ! অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
      429,
      requestId
    );
  }

  const body = await request.json();
  const validation = OrderCreateSchema.safeParse(body);

  if (!validation.success) {
    return errorResponse(
      validation.error.errors[0]?.message || 'ভুল অর্ডার তথ্য প্রদান করা হয়েছে',
      400,
      requestId,
      validation.error.errors
    );
  }

  const session = await getServerSession(request);
  const userId = session?.id || null;

  const order = await createOrder({
    items: validation.data.items,
    delivery: validation.data.delivery,
    couponCode: validation.data.couponCode,
    paymentMethod: validation.data.paymentMethod,
    userId,
    idempotencyKey,
    ip,
    userAgent,
    requestId
  });

  let paymentRedirectUrl = null;

  // If customer selected online payment (bKash/Nagad/Card)
  if (['bkash', 'nagad', 'card'].includes(validation.data.paymentMethod)) {
    const appUrl = ENV.APP.URL;
    const paymentInit = await initSSLCommerzPayment({ order, appUrl });
    if (paymentInit.success) {
      paymentRedirectUrl = paymentInit.gatewayUrl;
    } else {
      return errorResponse(
        paymentInit.message || 'পেমেন্ট গেটওয়ে শুরু করতে সমস্যা হয়েছে। অনুগ্রহ করে ক্যাশ অন ডেলিভারি বেছে নিন।',
        500,
        requestId
      );
    }
  }

  return successResponse(
    {
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.pricing.total,
        paymentMethod: order.payment.method,
        status: order.status
      },
      paymentRedirectUrl,
      message: 'আপনার অর্ডার সফলভাবে সিস্টেমে গৃহীত হয়েছে! 🌸'
    },
    201
  );
}, 'ORDERS_CREATE');

export const GET = withApiHandler(async (request) => {
  await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
  const skip = Math.max(0, parseInt(searchParams.get('skip') || '0', 10));

  const result = await getOrders({ status, search, limit, skip });

  return successResponse({
    ...result
  });
}, 'ORDERS_LIST');
