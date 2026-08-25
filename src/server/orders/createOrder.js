import connectToDatabase from '../../lib/db/mongodb.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import Coupon from '../../models/Coupon.js';
import { calculateOrder } from './calculateOrder.js';
import { ORDER_STATUS, PAYMENT_STATUS } from './stateMachine.js';
import { logAudit } from '../audit/logAudit.js';
import { OperationalError } from '../../lib/errors/apiHandler.js';
import mongoose from 'mongoose';

/**
 * Atomically create an order with guaranteed stock reservation
 */
export async function createOrder({
  items,
  delivery,
  couponCode = null,
  paymentMethod = 'cod',
  userId = null,
  idempotencyKey = null,
  ip = '',
  userAgent = '',
  requestId = ''
}) {
  await connectToDatabase();

  // 1. Idempotency protection against duplicate network requests
  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) {
      return existingOrder;
    }
  }

  // 2. Authoritative server price and stock calculation
  const { verifiedItems, pricing, coupon } = await calculateOrder({
    items,
    couponCode,
    deliveryZone: delivery.zone || 'dhaka_inside'
  });

  // 3. Atomically reserve inventory for database products
  const reservedProducts = [];
  try {
    for (const item of verifiedItems) {
      if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
        const reserved = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity }, isAvailable: true },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!reserved) {
          throw new OperationalError(
            `দুঃখিত, “${item.nameSnapshot}” এর স্টক এইমাত্র শেষ হয়ে গেছে। অনুগ্রহ করে কার্ট আপডেট করুন।`,
            400
          );
        }

        reservedProducts.push({ productId: item.productId, quantity: item.quantity });
      }
    }
  } catch (reservationError) {
    // Rollback already reserved stock in case of partial failure
    for (const res of reservedProducts) {
      await Product.findByIdAndUpdate(res.productId, {
        $inc: { stock: res.quantity }
      }).catch(() => {});
    }
    throw reservationError;
  }

  // 4. Atomically claim coupon usage
  let appliedCouponCode = null;
  let appliedCouponDiscount = 0;

  if (coupon && coupon.code) {
    const now = new Date();
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {
        code: coupon.code,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }]
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (updatedCoupon) {
      appliedCouponCode = updatedCoupon.code;
      appliedCouponDiscount = coupon.discount;
    } else {
      console.warn(`Coupon ${coupon.code} usage limit hit during checkout`);
    }
  }

  // 5. Generate secure order number
  const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;

  // 6. Define initial order and payment status
  const isOnlinePayment = ['bkash', 'nagad', 'card'].includes(paymentMethod);
  const initialOrderStatus = isOnlinePayment ? ORDER_STATUS.PENDING_PAYMENT : ORDER_STATUS.CONFIRMED;
  const initialPaymentStatus = isOnlinePayment ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.UNPAID;

  // 7. Persist Order document
  const order = await Order.create({
    orderNumber,
    customer: {
      userId: userId || null,
      name: delivery.name.trim(),
      phone: delivery.phone.trim(),
      altPhone: delivery.altPhone ? delivery.altPhone.trim() : '',
      email: delivery.email ? delivery.email.trim().toLowerCase() : ''
    },
    items: verifiedItems,
    delivery: {
      name: delivery.name.trim(),
      phone: delivery.phone.trim(),
      altPhone: delivery.altPhone ? delivery.altPhone.trim() : '',
      address: delivery.address.trim(),
      area: delivery.area || 'বনানী',
      city: delivery.city || 'ঢাকা',
      zone: delivery.zone || 'dhaka_inside',
      date: delivery.date,
      timeSlot: delivery.timeSlot || 'morning',
      giftMessage: delivery.giftMessage ? delivery.giftMessage.trim() : '',
      instructions: delivery.instructions ? delivery.instructions.trim() : ''
    },
    pricing,
    coupon: {
      code: appliedCouponCode,
      discount: appliedCouponDiscount
    },
    payment: {
      method: paymentMethod,
      status: initialPaymentStatus,
      transactionId: null,
      valId: null,
      paidAt: null
    },
    status: initialOrderStatus,
    inventoryReserved: true,
    inventoryReleased: false,
    idempotencyKey: idempotencyKey || null,
    statusHistory: [
      {
        status: initialOrderStatus,
        timestamp: new Date(),
        note: isOnlinePayment
          ? 'অর্ডার প্রস্তুত — অনলাইন পেমেন্টের অপেক্ষায়'
          : 'ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত হয়েছে',
        updatedBy: 'SYSTEM'
      }
    ]
  });

  await logAudit({
    actorId: userId,
    actorName: delivery.name,
    actorRole: 'CUSTOMER',
    action: 'CREATE_ORDER',
    resource: 'ORDER',
    resourceId: order._id.toString(),
    metadata: {
      orderNumber: order.orderNumber,
      total: pricing.total,
      method: paymentMethod,
      status: order.status
    },
    ip,
    userAgent,
    requestId
  });

  return order;
}
