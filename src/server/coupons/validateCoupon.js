import connectToDatabase from '../../lib/db/mongodb.js';
import Coupon from '../../models/Coupon.js';

/**
 * Authoritative Coupon Validation strictly against MongoDB
 *
 * @param {Object} params
 * @param {string} params.code - Coupon code
 * @param {number} params.orderSubtotal - Order subtotal in BDT
 * @returns {Promise<{ valid: boolean, code?: string, type?: string, discount: number, message: string }>}
 */
export async function validateCoupon({ code, orderSubtotal = 0 }) {
  if (!code || typeof code !== 'string') {
    return { valid: false, discount: 0, message: 'কুপন কোড প্রদান করুন' };
  }

  try {
    await connectToDatabase();

    const normalizedCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      return { valid: false, discount: 0, message: 'অবৈধ কুপন কোড! অনুগ্রহ করে সঠিক কোড দিন।' };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'এই কুপনটির কার্যকারিতা বর্তমানে নিষ্ক্রিয় করা আছে।' };
    }

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      return { valid: false, discount: 0, message: 'এই কুপনটি এখনো সক্রিয় হয়নি।' };
    }

    if (coupon.endDate && now > coupon.endDate) {
      return { valid: false, discount: 0, message: 'এই কুপনের মেয়াদ শেষ হয়ে গেছে।' };
    }

    if (coupon.minOrderAmount && orderSubtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `এই কুপনটি ব্যবহারের জন্য ন্যূনতম ৳${coupon.minOrderAmount.toLocaleString('bn-BD')} টাকার অর্ডার প্রয়োজন।`
      };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'এই কুপনটির ব্যবহারের সর্বোচ্চ সীমা পূর্ণ হয়ে গেছে।' };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((orderSubtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(orderSubtotal, coupon.value);
    }

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discount,
      message: `“${coupon.code}” কুপন সফলভাবে প্রযোজ্য হয়েছে! ৳${discount.toLocaleString('bn-BD')} সাশ্রয় হয়েছে। 🌸`
    };
  } catch (error) {
    console.error('Coupon validation error:', error.message);
    return { valid: false, discount: 0, message: 'কুপন যাচাই করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' };
  }
}
