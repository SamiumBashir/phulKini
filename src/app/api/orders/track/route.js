import { NextResponse } from 'next/server';
import { trackOrder } from '@/server/orders/trackOrder';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`order_track:${ip}`, 20, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'অতিরিক্ত ট্র্যাকিং অনুরোধ! কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { orderNumber, phone } = body;

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { success: false, message: 'অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই প্রয়োজন' },
        { status: 400 }
      );
    }

    const order = await trackOrder({ orderNumber, phone });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'উক্ত অর্ডার নম্বর বা ফোন নম্বরের কোনো অর্ডার পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'ট্র্যাকিং করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
