import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function getOrders({
  status = null,
  search = null,
  limit = 50,
  skip = 0
} = {}) {
  await connectToDatabase();

  const query = {};

  if (status && status !== 'ALL') {
    query.status = status;
  }

  if (search && search.trim()) {
    const q = search.trim();
    query.$or = [
      { orderNumber: new RegExp(q, 'i') },
      { 'customer.name': new RegExp(q, 'i') },
      { 'customer.phone': new RegExp(q, 'i') }
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(query)
  ]);

  return {
    orders: orders.map((o) => ({
      ...o,
      id: o._id.toString()
    })),
    total
  };
}
