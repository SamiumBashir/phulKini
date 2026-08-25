import connectToDatabase from '../../lib/db/mongodb.js';
import Order from '../../models/Order.js';
import mongoose from 'mongoose';

export async function getOrderById(orderNumberOrId, session = null) {
  await connectToDatabase();

  const isObjectId = mongoose.Types.ObjectId.isValid(orderNumberOrId);
  const query = isObjectId
    ? { $or: [{ _id: orderNumberOrId }, { orderNumber: orderNumberOrId }] }
    : { orderNumber: orderNumberOrId };

  const order = await Order.findOne(query).lean();
  if (!order) return null;

  // Authorization check: If logged in as customer, can only see own order
  if (session && session.role === 'CUSTOMER' && order.customer.userId) {
    if (order.customer.userId.toString() !== session.id) {
      throw new Error('অননুমোদিত অ্যাক্সেস! আপনি শুধুমাত্র আপনার নিজের অর্ডার দেখতে পারবেন।');
    }
  }

  return {
    ...order,
    id: order._id.toString()
  };
}
