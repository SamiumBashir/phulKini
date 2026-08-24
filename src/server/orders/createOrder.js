import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { calculateOrder } from './calculateOrder';
import { logAudit } from '@/server/audit/logAudit';
import mongoose from 'mongoose';

export async function createOrder({
  items,
  delivery,
  couponCode = null,
  paymentMethod = 'cod',
  userId = null,
  ip = '',
  userAgent = ''
}) {
  await connectToDatabase();

  // 1. Authoritative server price and stock calculation
  const { verifiedItems, pricing, coupon } = await calculateOrder({ items, couponCode });

  // 2. Generate unique order number (e.g. PK-492041)
  const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;

  // 3. Atomically decrement stock for database products
  for (const item of verifiedItems) {
    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }
  }

  // 4. Update coupon usage count if applied
  if (coupon && coupon.code) {
    await Coupon.findOneAndUpdate(
      { code: coupon.code },
      { $inc: { usedCount: 1 } }
    );
  }

  // 5. Create Order document
  const order = await Order.create({
    orderNumber,
    customer: {
      userId: userId || null,
      name: delivery.name,
      phone: delivery.phone,
      altPhone: delivery.altPhone || '',
      email: delivery.email || ''
    },
    items: verifiedItems,
    delivery: {
      name: delivery.name,
      phone: delivery.phone,
      altPhone: delivery.altPhone || '',
      address: delivery.address,
      area: delivery.area || 'বনানী',
      city: delivery.city || 'ঢাকা',
      date: delivery.date,
      timeSlot: delivery.timeSlot || 'morning',
      giftMessage: delivery.giftMessage || '',
      instructions: delivery.instructions || ''
    },
    pricing,
    coupon: coupon || { code: null, discount: 0 },
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'UNPAID' : 'PENDING',
      transactionId: null,
      valId: null,
      paidAt: null
    },
    status: 'CONFIRMED',
    statusHistory: [
      {
        status: 'CONFIRMED',
        timestamp: new Date(),
        note: 'অর্ডার সফলভাবে সিস্টেমে যুক্ত হয়েছে',
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
    metadata: { orderNumber: order.orderNumber, total: pricing.total, method: paymentMethod },
    ip,
    userAgent
  });

  return order;
}
