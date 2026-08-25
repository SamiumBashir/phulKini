import { NextResponse } from 'next/server';
import { validateSSLCommerzTransaction } from '@/server/payments/sslcommerz';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const valId = formData.get('val_id');
    const tranId = formData.get('tran_id');

    if (valId && tranId) {
      const result = await validateSSLCommerzTransaction({ valId, tranId });
      return NextResponse.json({ success: result.valid, message: 'IPN processed' });
    }

    return NextResponse.json({ success: false, message: 'Missing transaction parameters' }, { status: 400 });
  } catch (error) {
    console.error('SSLCOMMERZ IPN error:', error);
    return NextResponse.json({ success: false, message: 'IPN internal processing error' }, { status: 500 });
  }
}
