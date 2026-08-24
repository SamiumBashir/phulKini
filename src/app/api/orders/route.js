import { NextResponse } from 'next/server';
import { createOrder } from '@/server/orders/createOrder';
import { getOrders } from '@/server/orders/getOrders';
import { getServerSession, hasPermission } from '@/lib/security/auth';
import { OrderCreateSchema } from '@/lib/validations/order';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { initSSLCommerzPayment } from '@/server/payments/sslcommerz';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Rate limit: max 15 orders per minute per IP
    const rateLimit = await checkRateLimit(`order_create:${ip}`, 15, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'অতিরিক্ত অর্ডার অনুরোধ! কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = OrderCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || 'ভুল অর্ডার তথ্য' },
        { status: 400 }
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
      ip,
      userAgent
    });

    let paymentRedirectUrl = null;

    // If customer selected online payment (bKash/Nagad/Card via SSLCOMMERZ)
    if (['bkash', 'nagad', 'card'].includes(validation.data.paymentMethod)) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const paymentInit = await initSSLCommerzPayment({ order, appUrl });
      if (paymentInit.success) {
        paymentRedirectUrl = paymentInit.gatewayUrl;
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.pricing.total,
        paymentMethod: order.payment.method,
        status: order.status
      },
      paymentRedirectUrl,
      message: 'আপনার অর্ডার সফলভাবে গৃহীত হয়েছে! 🌸'
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'অর্ডার প্রসেস করতে সমস্যা হয়েছে' },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিন অর্ডার তালিকা দেখতে পারবেন।' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const result = await getOrders({ status, search, limit, skip });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'অর্ডার তালিকা লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
