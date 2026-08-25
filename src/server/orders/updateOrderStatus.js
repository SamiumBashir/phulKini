import connectToDatabase from '../../lib/db/mongodb.js';
import Order from '../../models/Order.js';
import { logAudit } from '../audit/logAudit.js';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  canTransitionOrder,
  releaseOrderInventory,
  rollbackOrderCoupon
} from './stateMachine.js';
import { OperationalError } from '../../lib/errors/apiHandler.js';

/**
 * Validated Order Status update using the state machine
 */
export async function updateOrderStatus({
  orderId,
  newStatus,
  note = '',
  actor = null,
  requestId = ''
}) {
  if (!orderId || !newStatus) {
    throw new OperationalError('অর্ডার আইডি এবং নতুন স্ট্যাটাস আবশ্যক', 400);
  }

  await connectToDatabase();

  const order = await Order.findById(orderId);
  if (!order) {
    throw new OperationalError('অর্ডারটি পাওয়া যায়নি', 404);
  }

  const oldStatus = order.status;

  // 1. Validate State Machine transition
  if (!canTransitionOrder(oldStatus, newStatus)) {
    throw new OperationalError(
      `স্ট্যাটাস পরিবর্তন অবৈধ! “${oldStatus}” থেকে “${newStatus}” এ পরিবর্তন অনুমোদিত নয়।`,
      400
    );
  }

  order.status = newStatus;

  // 2. Handle Delivery Completion (Mark COD orders as PAID)
  if (newStatus === ORDER_STATUS.DELIVERED && order.payment.method === 'cod') {
    order.payment.status = PAYMENT_STATUS.PAID;
    order.payment.paidAt = new Date();
  }

  // 3. Handle Cancellation & Refund (Rollback stock & coupons)
  if (newStatus === ORDER_STATUS.CANCELLED || newStatus === ORDER_STATUS.REFUNDED) {
    await releaseOrderInventory(order);
    await rollbackOrderCoupon(order);

    if (newStatus === ORDER_STATUS.REFUNDED) {
      order.payment.status = PAYMENT_STATUS.REFUNDED;
    }
  }

  // 4. Update status history
  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `স্ট্যাটাস পরিবর্তন: ${oldStatus} ➔ ${newStatus}`,
    updatedBy: actor ? `${actor.name} (${actor.role})` : 'SYSTEM'
  });

  await order.save();

  // 5. Log audit trail
  if (actor) {
    await logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_ORDER_STATUS',
      resource: 'ORDER',
      resourceId: order._id.toString(),
      metadata: {
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus,
        note
      },
      requestId
    });
  }

  return order;
}
