import connectToDatabase from '../../lib/db/mongodb.js';
import Product from '../../models/Product.js';
import { validateCoupon } from '../coupons/validateCoupon.js';
import { BUILDER_OPTIONS } from '../../data/builderOptions.js';
import { SITE_CONFIG } from '../../lib/config/siteConfig.js';
import { OperationalError } from '../../lib/errors/apiHandler.js';
import mongoose from 'mongoose';

/**
 * Calculate authoritative order pricing strictly on the server.
 * Never trust client prices, discounts, delivery fees, or totals.
 *
 * @param {Object} params
 * @param {Array} params.items - Cart items
 * @param {string|null} [params.couponCode] - Coupon code
 * @param {string} [params.deliveryZone='dhaka_inside'] - Selected delivery zone
 * @returns {Promise<{ verifiedItems: Array, pricing: Object, coupon: Object|null }>}
 */
export async function calculateOrder({ items = [], couponCode = null, deliveryZone = 'dhaka_inside' }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new OperationalError('কার্ট খালি! অনুগ্রহ করে পণ্য যুক্ত করুন।', 400);
  }

  const hasDbProducts = items.some((item) => item.productId && mongoose.Types.ObjectId.isValid(item.productId));
  if (hasDbProducts || couponCode) {
    try {
      await connectToDatabase();
    } catch (e) {
      if (hasDbProducts) {
        throw new OperationalError('ডাটাবেজ সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 500);
      }
    }
  }

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const quantity = Math.max(1, parseInt(item.quantity || 1, 10));

    // CASE A: Standard Catalog Product (via MongoDB Product ID)
    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      const dbProduct = await Product.findById(item.productId);

      if (!dbProduct || !dbProduct.isAvailable) {
        throw new OperationalError(`দুঃখিত, “${item.name || 'পণ্যটি'}” বর্তমানে কেনাকাটার জন্য উপলব্ধ নেই।`, 400);
      }

      if (dbProduct.stock < quantity) {
        throw new OperationalError(
          `দুঃখিত, “${dbProduct.name}” এর পর্যাপ্ত স্টক নেই (মওজুদ: ${dbProduct.stock}টি, নির্বাচিত: ${quantity}টি)।`,
          400
        );
      }

      const unitPrice = Math.round(dbProduct.price);
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      const imageSnapshot =
        Array.isArray(dbProduct.images) && dbProduct.images.length > 0
          ? typeof dbProduct.images[0] === 'string'
            ? dbProduct.images[0]
            : dbProduct.images[0]?.url || ''
          : '';

      verifiedItems.push({
        productId: dbProduct._id,
        nameSnapshot: dbProduct.name,
        englishNameSnapshot: dbProduct.englishName || '',
        imageSnapshot,
        unitPrice,
        quantity,
        subtotal: itemSubtotal,
        customBouquetDetails: null
      });
    }
    // CASE B: Custom Bouquet Builder Creation
    else if (item.customBouquetConfig || item.customDetails?.isCustom) {
      const config = item.customBouquetConfig || {};
      const customDetails = item.customDetails || {};

      // 1. Calculate flowers price strictly from server builder options
      const selectedFlowers = config.flowers || customDetails.selectedFlowers || {};
      let calculatedFlowerCost = 0;
      let totalStems = 0;
      const flowerBreakdown = [];

      for (const [flowerId, count] of Object.entries(selectedFlowers)) {
        const flowerCount = Math.max(0, parseInt(count, 10));
        if (flowerCount > 0) {
          const flowerDef = BUILDER_OPTIONS.flowers.find((f) => f.id === flowerId);
          if (flowerDef) {
            const cost = flowerDef.pricePerStem * flowerCount;
            calculatedFlowerCost += cost;
            totalStems += flowerCount;
            flowerBreakdown.push({
              id: flowerDef.id,
              name: flowerDef.name,
              count: flowerCount,
              pricePerStem: flowerDef.pricePerStem,
              subtotal: cost
            });
          }
        }
      }

      // 2. Size base fee
      const sizeId = config.sizeId || customDetails.sizeId || 'deluxe';
      const sizeDef = BUILDER_OPTIONS.sizes.find((s) => s.id === sizeId) || BUILDER_OPTIONS.sizes[1];
      const sizeCost = sizeDef.basePrice || 0;

      // 3. Wrapping price
      const wrappingId = config.wrappingId || customDetails.wrappingId || 'burgundy-matte';
      const wrappingDef = BUILDER_OPTIONS.wrappings.find((w) => w.id === wrappingId) || BUILDER_OPTIONS.wrappings[0];
      const wrappingCost = wrappingDef.price || 0;

      // 4. Add-ons price
      const addOnIds = Array.isArray(config.addOnIds) ? config.addOnIds : customDetails.addOnIds || [];
      let addOnsCost = 0;
      const addOnBreakdown = [];

      for (const addOnId of addOnIds) {
        const addOnDef = BUILDER_OPTIONS.addOns.find((a) => a.id === addOnId);
        if (addOnDef) {
          addOnsCost += addOnDef.price;
          addOnBreakdown.push({
            id: addOnDef.id,
            name: addOnDef.name,
            price: addOnDef.price
          });
        }
      }

      // 5. Total unit price calculated authoritatively
      const unitPrice = Math.round(calculatedFlowerCost + sizeCost + wrappingCost + addOnsCost);
      if (unitPrice <= 0) {
        throw new OperationalError('কাস্টম তোড়ার তথ্যে ত্রুটি পাওয়া গেছে। অনুগ্রহ করে আবার সাজিয়ে নিন।', 400);
      }

      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      verifiedItems.push({
        productId: null,
        nameSnapshot: item.name || `কাস্টম তোড়া (${sizeDef.name})`,
        englishNameSnapshot: 'Custom Tailored Bouquet',
        imageSnapshot:
          wrappingDef.image ||
          'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000&auto=format&fit=crop',
        unitPrice,
        quantity,
        subtotal: itemSubtotal,
        customBouquetDetails: {
          size: sizeDef.name,
          totalStems,
          wrapping: wrappingDef.name,
          flowers: flowerBreakdown,
          addOns: addOnBreakdown,
          recipientName: config.recipientName || customDetails.recipientName || '',
          giftMessage: config.customMessage || customDetails.customMessage || ''
        }
      });
    } else {
      throw new OperationalError('অর্ডারের পণ্যের তালিকা সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।', 400);
    }
  }

  // Authoritative Delivery Fee calculation
  let deliveryFee = SITE_CONFIG.delivery.standardFeeDhaka;
  if (subtotal >= SITE_CONFIG.delivery.freeThreshold) {
    deliveryFee = 0;
  } else if (deliveryZone === 'dhaka_express') {
    deliveryFee = SITE_CONFIG.delivery.expressFeeDhaka;
  } else if (deliveryZone === 'dhaka_midnight') {
    deliveryFee = SITE_CONFIG.delivery.midnightFeeDhaka;
  }

  // Validate coupon server-side
  let discount = 0;
  let validatedCoupon = null;

  if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
    const couponResult = await validateCoupon({ code: couponCode, orderSubtotal: subtotal });
    if (couponResult.valid) {
      discount = Math.round(couponResult.discount);
      validatedCoupon = {
        code: couponResult.code,
        discount: discount
      };
    }
  }

  const grandTotal = Math.max(0, Math.round(subtotal + deliveryFee - discount));

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
