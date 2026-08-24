'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  Check
} from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    totalItemsCount,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    isDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeCartDrawer();
    router.push('/checkout');
  };

  // Free delivery progress (Target ৳5,000)
  const freeDeliveryThreshold = 5000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-bengali">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-white border-l border-border-muted shadow-soft-xl flex flex-col justify-between animate-slide-up">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-border-subtle bg-surface-bg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-main-text leading-tight">
                  আপনার শপিং কার্ট
                </h2>
                <p className="text-xs text-main-muted">
                  {items.length > 0
                    ? `কার্টে ${toBengaliNumber(totalItemsCount)}টি আইটেম আছে`
                    : 'কার্ট খালি'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="p-2 text-main-muted hover:text-primary rounded-lg hover:bg-surface-soft transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free delivery bar */}
          {items.length > 0 && (
            <div className="bg-primary-subtle px-5 py-2.5 border-b border-border-subtle text-xs text-main-text">
              {remainingForFreeDelivery === 0 ? (
                <div className="flex items-center gap-1.5 text-accent-green font-medium">
                  <Sparkles size={14} className="text-accent-green" />
                  <span>অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন 🎉</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span>
                      আর মাত্র <strong>{formatBengaliPrice(remainingForFreeDelivery)}</strong> এর কেনাকাটায় ফ্রি ডেলিভারি!
                    </span>
                    <span className="font-semibold text-primary">{toBengaliNumber(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-[#E5D7D5] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-surface-soft border border-border-muted flex items-center justify-center text-3xl mb-4">
                  🌸
                </div>
                <h3 className="text-base font-bold text-main-text">
                  আপনার কার্ট এখনো খালি 🌸
                </h3>
                <p className="text-xs text-main-muted mt-1.5 mb-6 max-w-xs mx-auto">
                  প্রিয়জনের জন্য পছন্দ করুন তাজা ফুল, নান্দনিক তোড়া কিংবা কাস্টমাইজড উপহার বক্স।
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    router.push('/shop');
                  }}
                  className="btn-primary-burgundy text-sm py-2.5 px-6"
                >
                  ফুল দেখতে যান →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-surface-soft/60 border border-border-subtle hover:border-border-muted transition-colors relative"
                >
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-border-subtle shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-main-text line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-main-subtle hover:text-red-600 transition-colors p-0.5"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="text-xs text-main-muted mt-0.5">
                        {item.categoryName || item.customDetails?.label || 'ফ্লোরাল তোড়া'}
                      </p>

                      {item.customDetails && (
                        <div className="mt-1 text-[11px] text-primary bg-primary-light/50 px-2 py-0.5 rounded inline-block font-medium">
                          কাস্টম তোড়া: {item.customDetails.flowerCount || ''}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-border-subtle/50">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border-muted rounded-lg bg-surface-white">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="p-1 text-main-muted hover:text-primary hover:bg-surface-soft rounded-l"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-main-text font-sans">
                          {toBengaliNumber(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="p-1 text-main-muted hover:text-primary hover:bg-surface-soft rounded-r"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-primary">
                        {formatBengaliPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-border-muted bg-surface-bg space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent-green-light border border-accent-green/30 text-xs text-accent-green">
                    <div className="flex items-center gap-1.5">
                      <Check size={14} className="text-accent-green" />
                      <span>
                        কুপন <strong>{appliedCoupon.code}</strong> অ্যাপ্লাই করা হয়েছে (-{formatBengaliPrice(discountAmount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:underline font-semibold ml-2"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-main-subtle" />
                      <input
                        type="text"
                        placeholder="কুপন কোড (যদি থাকে)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-surface-white border border-border-muted rounded-xl text-xs text-main-text placeholder:text-main-subtle focus:outline-none focus:border-primary uppercase font-sans font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-dark transition-colors"
                    >
                      অ্যাপ্লাই
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-main-muted">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-main-text">{formatBengaliPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-main-text">
                    {deliveryFee === 0 ? (
                      <span className="text-accent-green font-bold">ফ্রি (০)</span>
                    ) : (
                      formatBengaliPrice(deliveryFee)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-accent-green font-medium">
                    <span>কুপন ডিসকাউন্ট</span>
                    <span>-{formatBengaliPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-border-muted flex justify-between items-baseline">
                  <span className="text-base font-bold text-main-text">সর্বমোট</span>
                  <span className="text-xl font-bold text-primary">{formatBengaliPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full btn-primary-burgundy py-3 text-base font-bold shadow-soft flex items-center justify-center gap-2"
              >
                <span>Checkout করুন</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-main-muted opacity-80 pt-0.5">
                <ShieldCheck size={14} className="text-accent-green" />
                <span>🔒 নিরাপদ পেমেন্ট গ্যারান্টি • ১০০% সতেজ ফুল</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
