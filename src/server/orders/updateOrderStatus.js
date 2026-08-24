import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { logAudit } from '@/server/audit/logAudit';

export async function updateOrderStatus({
  orderId,
  newStatus,
  note = '',
  actor = null
}) {
  await connectToDatabase();

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('অর্ডার পাওয়া যায়নি');
  }

  const oldStatus = order.status;
  order.status = newStatus;

  // If status is DELIVERED and payment was COD, update payment status to PAID
  if (newStatus === 'DELIVERED' && order.payment.method === 'cod') {
    order.payment.status = 'PAID';
    order.payment.paidAt = new Date();
  }

  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `স্ট্যাটাস পরিবর্তন: ${oldStatus} ➔ ${newStatus}`,
    updatedBy: actor ? actor.name : 'ADMIN'
  });

  await order.save();

  if (actor) {
    await logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_ORDER_STATUS',
      resource: 'ORDER',
      resourceId: order._id.toString(),
      metadata: { orderNumber: order.orderNumber, oldStatus, newStatus }
    });
  }

  return order;
}
