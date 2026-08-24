import { NextResponse } from 'next/server';
import { validateSSLCommerzTransaction } from '@/server/payments/sslcommerz';
import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const valId = formData.get('val_id');
    const tranId = formData.get('tran_id');
    const status = formData.get('status');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status === 'VALID' || status === 'VALIDATED') {
      // Server-side validation with SSLCOMMERZ
      await validateSSLCommerzTransaction({ valId, tranId });
      return NextResponse.redirect(`${appUrl}/order-confirmation?orderId=${tranId}&status=success`, 303);
    } else if (status === 'FAILED') {
      await connectToDatabase();
      await Order.findOneAndUpdate({ orderNumber: tranId }, { 'payment.status': 'FAILED' });
      return NextResponse.redirect(`${appUrl}/checkout?error=payment_failed`, 303);
    } else {
      return NextResponse.redirect(`${appUrl}/checkout?error=payment_cancelled`, 303);
    }
  } catch (error) {
    console.error('SSLCOMMERZ callback error:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/checkout?error=payment_error`, 303);
  }
}
