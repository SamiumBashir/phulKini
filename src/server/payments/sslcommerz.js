import connectToDatabase from '../../lib/db/mongodb.js';
import Order from '../../models/Order.js';
import { logAudit } from '../audit/logAudit.js';
import { ENV } from '../../lib/config/env.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../orders/stateMachine.js';

const STORE_ID = ENV.PAYMENTS.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = ENV.PAYMENTS.SSLCOMMERZ_STORE_PASSWORD;
const IS_LIVE = ENV.PAYMENTS.SSLCOMMERZ_IS_LIVE;

const BASE_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com'
  : 'https://sandbox.sslcommerz.com';

/**
 * Initialize SSLCOMMERZ Payment Session
 */
export async function initSSLCommerzPayment({ order, appUrl }) {
  if (!order || !order.pricing || !order.pricing.total) {
    return { success: false, message: 'অবৈধ অর্ডার তথ্য' };
  }

  // Development simulation mode (only allowed if explicitly enabled in non-production)
  if (ENV.PAYMENTS.PAYMENT_SIMULATION && !ENV.IS_PRODUCTION) {
    console.warn(`[DEV] Payment simulation enabled for order ${order.orderNumber}`);
    return {
      success: true,
      gatewayUrl: `${appUrl}/order-confirmation?orderId=${order.orderNumber}&status=simulated_dev`,
      isSimulation: true
    };
  }

  if (!STORE_ID || !STORE_PASSWORD) {
    console.error('SSLCOMMERZ credentials missing in environment');
    return {
      success: false,
      message: 'পেমেন্ট গেটওয়ে কনফিগারেশন অনুপস্থিত। অনুগ্রহ করে ক্যাশ অন ডেলিভারি নির্বাচন করুন।'
    };
  }

  const initUrl = `${BASE_URL}/gwprocess/v4/api.php`;

  const payload = new URLSearchParams({
    store_id: STORE_ID,
    store_passwd: STORE_PASSWORD,
    total_amount: order.pricing.total.toString(),
    currency: 'BDT',
    tran_id: order.orderNumber,
    success_url: `${appUrl}/api/payments/sslcommerz/callback?status=success&orderNumber=${order.orderNumber}`,
    fail_url: `${appUrl}/api/payments/sslcommerz/callback?status=fail&orderNumber=${order.orderNumber}`,
    cancel_url: `${appUrl}/api/payments/sslcommerz/callback?status=cancel&orderNumber=${order.orderNumber}`,
    ipn_url: `${appUrl}/api/payments/sslcommerz/ipn`,
    cus_name: order.delivery.name || 'Phul Kini Customer',
    cus_email: order.customer.email || 'customer@phulkini.com',
    cus_add1: order.delivery.address || 'Dhaka',
    cus_city: order.delivery.city || 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: order.delivery.phone || '01700000000',
    shipping_method: 'COURIER',
    num_of_item: order.items.length.toString(),
    product_name: 'Phul Kini Flowers',
    product_category: 'Boutique Florist',
    product_profile: 'general'
  });

  try {
    const response = await fetch(initUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString()
    });

    const data = await response.json();

    if (data.status === 'SUCCESS' && data.GatewayPageURL) {
      return {
        success: true,
        gatewayUrl: data.GatewayPageURL,
        sessionKey: data.sessionkey
      };
    } else {
      console.error('SSLCOMMERZ initialization failed:', data);
      return {
        success: false,
        message: data.failedreason || 'পেমেন্ট গেটওয়ে শুরু করতে সমস্যা হয়েছে।'
      };
    }
  } catch (error) {
    console.error('SSLCOMMERZ connection error:', error.message);
    return {
      success: false,
      message: 'পেমেন্ট গেটওয়ে সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।'
    };
  }
}

/**
 * Server-Side Cryptographic Validation of SSLCOMMERZ Transaction
 */
export async function validateSSLCommerzTransaction({ valId, tranId }) {
  if (!valId || !tranId) {
    return { valid: false, message: 'যাচাইকরণ প্যারামিটার অনুপস্থিত' };
  }

  try {
    await connectToDatabase();
    const order = await Order.findOne({ orderNumber: tranId });

    if (!order) {
      return { valid: false, message: 'অর্ডারটি খুঁজে পাওয়া যায়নি' };
    }

    // Idempotency: If already verified and marked PAID, do not re-process
    if (order.payment.status === PAYMENT_STATUS.PAID) {
      return { valid: true, order, alreadyPaid: true };
    }

    if (!STORE_ID || !STORE_PASSWORD) {
      return { valid: false, message: 'পেমেন্ট ভেরিফিকেশন ক্রেডেনশিয়াল অনুপস্থিত' };
    }

    const validationUrl = `${BASE_URL}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(
      valId
    )}&store_id=${encodeURIComponent(STORE_ID)}&store_passwd=${encodeURIComponent(STORE_PASSWORD)}&format=json`;

    const response = await fetch(validationUrl);
    const data = await response.json();

    if (data.status === 'VALID' || data.status === 'VALIDATED') {
      // Security Check 1: Verify amount matches order total exactly
      const paidAmount = Math.round(parseFloat(data.amount || '0'));
      const orderTotal = Math.round(order.pricing.total);

      if (paidAmount !== orderTotal) {
        console.error(`[SECURITY ALERT] Payment amount mismatch for ${tranId}: Paid=${paidAmount}, Expected=${orderTotal}`);
        order.payment.status = PAYMENT_STATUS.FAILED;
        await order.save();
        return { valid: false, message: 'পরিশোধিত অর্থের পরিমাণ অর্ডারের সাথে মেলেনি।' };
      }

      // Security Check 2: Verify currency is BDT
      if (data.currency && data.currency !== 'BDT') {
        return { valid: false, message: 'মুদ্রা (Currency) সঠিক নয়।' };
      }

      // Update Order & Payment status
      order.payment.status = PAYMENT_STATUS.PAID;
      order.payment.transactionId = data.tran_id || tranId;
      order.payment.valId = data.val_id || valId;
      order.payment.bankTranId = data.bank_tran_id || '';
      order.payment.cardType = data.card_type || data.card_brand || '';
      order.payment.paidAt = new Date();
      order.status = ORDER_STATUS.CONFIRMED;

      order.statusHistory.push({
        status: ORDER_STATUS.CONFIRMED,
        timestamp: new Date(),
        note: `অনলাইন পেমেন্ট সম্পন্ন (${data.card_type || 'SSLCOMMERZ'} - ৳${paidAmount})`,
        updatedBy: 'SSLCOMMERZ_GATEWAY'
      });

      await order.save();

      await logAudit({
        action: 'PAYMENT_VERIFIED',
        resource: 'PAYMENT',
        resourceId: order._id.toString(),
        metadata: {
          orderNumber: tranId,
          valId,
          amount: paidAmount,
          cardType: order.payment.cardType
        }
      });

      return { valid: true, order, data };
    }

    // Payment validation failed
    order.payment.status = PAYMENT_STATUS.FAILED;
    await order.save();

    return { valid: false, message: data.error || 'পেমেন্ট গেটওয়ে ভেরিফিকেশন ব্যর্থ হয়েছে' };
  } catch (error) {
    console.error('SSLCOMMERZ validation error:', error.message);
    return { valid: false, message: 'পেমেন্ট যাচাইকরণে ত্রুটি ঘটেছে', error: error.message };
  }
}
