import Product from '../../models/Product.js';
import Coupon from '../../models/Coupon.js';
import mongoose from 'mongoose';

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export const VALID_ORDER_TRANSITIONS = {
  [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.READY_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY_FOR_DELIVERY]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.REFUNDED]: []
};

export const VALID_PAYMENT_TRANSITIONS = {
  [PAYMENT_STATUS.UNPAID]: [PAYMENT_STATUS.PAID, PAYMENT_STATUS.FAILED],
  [PAYMENT_STATUS.PENDING]: [PAYMENT_STATUS.PAID, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.UNPAID],
  [PAYMENT_STATUS.PAID]: [PAYMENT_STATUS.REFUNDED],
  [PAYMENT_STATUS.FAILED]: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.UNPAID],
  [PAYMENT_STATUS.REFUNDED]: []
};

/**
 * Validate order state transition
 */
export function canTransitionOrder(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_ORDER_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

/**
 * Validate payment state transition
 */
export function canTransitionPayment(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_PAYMENT_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

/**
 * Atomically release reserved inventory for a cancelled or refunded order
 * @param {Object} order - Mongoose Order document
 */
export async function releaseOrderInventory(order) {
  if (!order || order.inventoryReleased) return;

  for (const item of order.items) {
    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      ).catch((err) => {
        console.error(`Failed to restock product ${item.productId}:`, err.message);
      });
    }
  }

  order.inventoryReleased = true;
  order.inventoryReserved = false;
}

/**
 * Atomically rollback coupon usage count for a cancelled or refunded order
 * @param {Object} order - Mongoose Order document
 */
export async function rollbackOrderCoupon(order) {
  if (!order || !order.coupon || !order.coupon.code) return;

  await Coupon.findOneAndUpdate(
    { code: order.coupon.code, usedCount: { $gt: 0 } },
    { $inc: { usedCount: -1 } }
  ).catch((err) => {
    console.error(`Failed to rollback coupon ${order.coupon.code}:`, err.message);
  });
}
