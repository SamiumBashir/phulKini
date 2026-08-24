import connectToDatabase from '@/lib/db/mongodb';
import Coupon from '@/models/Coupon';

export async function validateCoupon({ code, orderSubtotal = 0 }) {
  if (!code) return { valid: false, discount: 0, message: 'কুপন কোড প্রদান করুন' };

  try {
    await connectToDatabase();

    const normalizedCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      // Check fallback hardcoded coupons if database empty
      if (normalizedCode === 'PHUL10') {
        const discount = Math.round(orderSubtotal * 0.10);
        return { valid: true, code: 'PHUL10', discount, message: '১০% মূল্যছাড় যুক্ত হয়েছে! 🌸' };
      }
      if (normalizedCode === 'BOSONTO20' && orderSubtotal >= 3000) {
        const discount = Math.round(orderSubtotal * 0.20);
        return { valid: true, code: 'BOSONTO20', discount, message: '২০% বসন্ত ছাড় যুক্ত হয়েছে! 🌸' };
      }
      if (normalizedCode === 'LOVE2026' && orderSubtotal >= 4000) {
        return { valid: true, code: 'LOVE2026', discount: 500, message: '৳৫০০ ইনস্ট্যান্ট ছাড় যুক্ত হয়েছে! 🌸' };
      }
      return { valid: false, discount: 0, message: 'অবৈধ কুপন কোড! অনুগ্রহ করে সঠিক কোড দিন।' };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'এই কুপনটির মেয়াদ বা কার্যকারিতা শেষ হয়ে গেছে।' };
    }

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      return { valid: false, discount: 0, message: 'এই কুপনটি এখনো সক্রিয় হয়নি।' };
    }
    if (coupon.endDate && now > coupon.endDate) {
      return { valid: false, discount: 0, message: 'কুপনের মেয়াদ শেষ হয়ে গেছে।' };
    }

    if (coupon.minOrderAmount && orderSubtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `এই কুপনটি ব্যবহারের জন্য ন্যূনতম ৳${coupon.minOrderAmount.toLocaleString('bn-BD')} অর্ডারের প্রয়োজন।`
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
      discount = coupon.value;
    }

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discount,
      message: `“${coupon.code}” কুপন সফলভাবে প্রয়োগ হয়েছে! ৳${discount.toLocaleString('bn-BD')} সাশ্রয় হয়েছে।`
    };
  } catch (error) {
    console.warn('Coupon validation database fallback:', error.message);
    return { valid: false, discount: 0, message: 'কুপন যাচাই করতে সমস্যা হয়েছে।' };
  }
}
