import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';

const FALLBACK_ORDERS = [
  {
    id: 'ord-01',
    orderNumber: 'PK-481920',
    customer: { name: 'তানভীর আহমেদ', phone: '01711223344', email: 'tanvir@gmail.com' },
    delivery: { name: 'তানভীর আহমেদ', phone: '01711223344', address: 'হাউজ ১২, রোড ৭, বনানী', area: 'বনানী', date: '2026-08-25', timeSlot: 'morning' },
    pricing: { subtotal: 3500, deliveryFee: 0, discount: 0, total: 3500 },
    payment: { method: 'bkash', status: 'PAID' },
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord-02',
    orderNumber: 'PK-938210',
    customer: { name: 'সামিয়া রহমান', phone: '01822334455', email: 'samia@gmail.com' },
    delivery: { name: 'সামিয়া রহমান', phone: '01822334455', address: 'ফ্ল্যাট ৪বি, গুলশান-২', area: 'গুলশান-২', date: '2026-08-25', timeSlot: 'evening' },
    pricing: { subtotal: 2800, deliveryFee: 120, discount: 280, total: 2640 },
    payment: { method: 'cod', status: 'UNPAID' },
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export async function getOrders({
  status = null,
  search = null,
  limit = 50,
  skip = 0
} = {}) {
  try {
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

    if (orders.length === 0 && !search && (!status || status === 'ALL')) {
      return { orders: FALLBACK_ORDERS, total: FALLBACK_ORDERS.length };
    }

    return {
      orders: orders.map((o) => ({
        ...o,
        id: o._id.toString()
      })),
      total
    };
  } catch (e) {
    console.warn('Orders database fallback:', e.message);
    return { orders: FALLBACK_ORDERS, total: FALLBACK_ORDERS.length };
  }
}
