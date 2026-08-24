import { NextResponse } from 'next/server';
import { validateSSLCommerzTransaction } from '@/server/payments/sslcommerz';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const valId = formData.get('val_id');
    const tranId = formData.get('tran_id');

    if (valId && tranId) {
      await validateSSLCommerzTransaction({ valId, tranId });
    }

    return NextResponse.json({ success: true, message: 'IPN received' });
  } catch (error) {
    console.error('SSLCOMMERZ IPN error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
