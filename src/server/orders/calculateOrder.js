import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { validateCoupon } from '@/server/coupons/validateCoupon';
import mongoose from 'mongoose';

export const FREE_DELIVERY_THRESHOLD = 5000;
export const STANDARD_DELIVERY_FEE = 120;

export async function calculateOrder({ items = [], couponCode = null }) {
  await connectToDatabase();

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    let unitPrice = Number(item.price) || 2500;
    let nameSnapshot = item.name || 'ফুলের তোড়া';
    let englishNameSnapshot = item.englishName || '';
    let imageSnapshot = item.images && item.images[0] ? item.images[0] : item.image || '';

    // If item has a valid MongoDB product ID, fetch authoritative price & stock from DB
    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      const dbProduct = await Product.findById(item.productId);
      if (dbProduct) {
        unitPrice = dbProduct.price;
        nameSnapshot = dbProduct.name;
        englishNameSnapshot = dbProduct.englishName;
        imageSnapshot = dbProduct.images && dbProduct.images[0] ? dbProduct.images[0] : imageSnapshot;

        // Check stock availability
        if (dbProduct.stock < item.quantity) {
          throw new Error(`দুঃখিত, “${dbProduct.name}” এর পর্যাপ্ত স্টক নেই (মওজুদ: ${dbProduct.stock}টি)`);
        }
      }
    }

    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;

    verifiedItems.push({
      productId: item.productId && mongoose.Types.ObjectId.isValid(item.productId) ? item.productId : null,
      nameSnapshot,
      englishNameSnapshot,
      imageSnapshot,
      unitPrice,
      quantity: item.quantity,
      subtotal: itemSubtotal
    });
  }

  // Calculate Delivery Fee (Free if subtotal >= 5000)
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  // Validate Coupon
  let discount = 0;
  let validatedCoupon = null;

  if (couponCode) {
    const couponResult = await validateCoupon({ code: couponCode, orderSubtotal: subtotal });
    if (couponResult.valid) {
      discount = couponResult.discount;
      validatedCoupon = {
        code: couponResult.code,
        discount: couponResult.discount
      };
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return {
    verifiedItems,
    pricing: {
      subtotal,
      discount,
      deliveryFee,
      total: grandTotal
    },
    coupon: validatedCoupon
  };
}
