import { NextResponse } from 'next/server';
import { validateSSLCommerzTransaction } from '@/server/payments/sslcommerz';
import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { releaseOrderInventory, rollbackOrderCoupon, ORDER_STATUS, PAYMENT_STATUS } from '@/server/orders/stateMachine';
import { ENV } from '@/lib/config/env';

export async function POST(request) {
  const appUrl = ENV.APP.URL;

  try {
    const formData = await request.formData();
    const valId = formData.get('val_id');
    const tranId = formData.get('tran_id');
    const status = formData.get('status');

    if (!tranId) {
      return NextResponse.redirect(`${appUrl}/checkout?error=invalid_callback`, 303);
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderNumber: tranId });

    if (!order) {
      return NextResponse.redirect(`${appUrl}/checkout?error=order_not_found`, 303);
    }

    if (status === 'VALID' || status === 'VALIDATED') {
      const validationResult = await validateSSLCommerzTransaction({ valId, tranId });

      if (validationResult.valid) {
        return NextResponse.redirect(`${appUrl}/order-confirmation?orderId=${tranId}&status=success`, 303);
      } else {
        // Validation failed, release reserved inventory
        await releaseOrderInventory(order);
        await rollbackOrderCoupon(order);
        order.status = ORDER_STATUS.CANCELLED;
        order.payment.status = PAYMENT_STATUS.FAILED;
        await order.save();

        return NextResponse.redirect(
          `${appUrl}/checkout?error=${encodeURIComponent(validationResult.message || 'payment_verification_failed')}`,
          303
        );
      }
    } else if (status === 'FAILED') {
      await releaseOrderInventory(order);
      await rollbackOrderCoupon(order);
      order.status = ORDER_STATUS.CANCELLED;
      order.payment.status = PAYMENT_STATUS.FAILED;
      await order.save();

      return NextResponse.redirect(`${appUrl}/checkout?error=payment_failed`, 303);
    } else {
      // Cancelled
      await releaseOrderInventory(order);
      await rollbackOrderCoupon(order);
      order.status = ORDER_STATUS.CANCELLED;
      order.payment.status = PAYMENT_STATUS.FAILED;
      await order.save();

      return NextResponse.redirect(`${appUrl}/checkout?error=payment_cancelled`, 303);
    }
  } catch (error) {
    console.error('SSLCOMMERZ callback error:', error);
    return NextResponse.redirect(`${appUrl}/checkout?error=payment_error`, 303);
  }
}
