import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { requireRole } from '@/lib/security/auth';
import { withApiHandler, successResponse } from '@/lib/errors/apiHandler';

export const GET = withApiHandler(async (request) => {
  await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);

  await connectToDatabase();

  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts,
    lowStockProducts,
    totalCustomers,
    recentOrders,
    salesData
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['PENDING_PAYMENT', 'CONFIRMED'] } }),
    Order.countDocuments({ status: { $in: ['PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'] } }),
    Order.countDocuments({ status: 'DELIVERED' }),
    Order.countDocuments({ status: { $in: ['CANCELLED', 'REFUNDED'] } }),
    Product.countDocuments({ isAvailable: true }),
    Product.countDocuments({ stock: { $lte: 5 } }),
    User.countDocuments({ role: 'CUSTOMER' }),
    Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    Order.aggregate([
      { $match: { status: { $nin: ['CANCELLED', 'REFUNDED'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
    ])
  ]);

  const totalRevenue = salesData[0]?.totalRevenue || 0;

  return successResponse({
    stats: {
      totalRevenue,
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers
    },
    recentOrders: recentOrders.map((o) => ({
      ...o,
      id: o._id.toString()
    }))
  });
}, 'ADMIN_ANALYTICS');
