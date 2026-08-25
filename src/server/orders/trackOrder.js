import connectToDatabase from '../../lib/db/mongodb.js';
import Order from '../../models/Order.js';
import { OperationalError } from '../../lib/errors/apiHandler.js';

export async function trackOrder({ orderNumber, phone }) {
  if (!orderNumber || !phone) {
    throw new OperationalError('অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই আবশ্যক', 400);
  }

  await connectToDatabase();

  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

  if (cleanPhone.length < 11) {
    throw new OperationalError('১১ ডিজিটের সঠিক মোবাইল নম্বর প্রদান করুন', 400);
  }

  const order = await Order.findOne({
    orderNumber: cleanOrderNum,
    'customer.phone': new RegExp(cleanPhone.slice(-10) + '$')
  }).lean();

  if (!order) {
    return null;
  }

  // Return minimal safe public payload (protect sensitive personal address/billing credentials)
  return {
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    recipientName: order.delivery.name,
    area: order.delivery.area,
    city: order.delivery.city,
    deliveryDate: order.delivery.date,
    timeSlot: order.delivery.timeSlot,
    status: order.status,
    statusHistory: order.statusHistory || [],
    items: order.items.map((it) => ({
      name: it.nameSnapshot,
      image: it.imageSnapshot,
      quantity: it.quantity,
      price: it.unitPrice,
      subtotal: it.subtotal
    })),
    pricing: order.pricing,
    paymentMethod: order.payment.method,
    paymentStatus: order.payment.status,
    createdAt: order.createdAt
  };
}
