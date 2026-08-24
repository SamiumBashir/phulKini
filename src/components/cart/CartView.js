'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  Check,
  ChevronLeft
} from 'lucide-react';

export default function CartView() {
  const router = useRouter();
  const {
    items,
    totalItemsCount,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 max-w-container mx-auto px-4 md:px-8 text-center font-bengali">
        <div className="max-w-md mx-auto card-luxury p-8 sm:p-12 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-surface-soft border border-border-muted flex items-center justify-center text-4xl mb-2">
            🌸
          </div>
          <h2 className="text-2xl font-bold text-main-text">
            আপনার কার্ট এখনো খালি 🌸
          </h2>
          <p className="text-xs sm:text-sm text-main-muted">
            প্রিয়জনের জন্য বেছে নিন সতেজ ফুল, সুন্দর তোড়া আর হৃদয়ছোঁয়া উপহার।
          </p>
          <div className="pt-4">
            <Link href="/shop" className="btn-primary-burgundy text-sm py-3 px-8">
              ফুল দেখতে যান →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-border-subtle pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-main-text">
              আপনার শপিং কার্ট
            </h1>
            <p className="text-xs sm:text-sm text-main-muted mt-1">
              কার্টে {toBengaliNumber(totalItemsCount)}টি আইটেম আছে
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs sm:text-sm text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>আরও ফুল যোগ করুন</span>
          </Link>
        </div>

        {/* 2-Column Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-surface-white border border-border-muted rounded-3xl p-4 sm:p-6 shadow-soft divide-y divide-border-subtle">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-border-subtle shrink-0"
                    />

                    <div>
                      <h3 className="font-bold text-base text-main-text leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-main-muted mt-0.5">
                        ক্যাটাগরি: {item.categoryName || 'ফ্লোরাল তোড়া'}
                      </p>

                      {item.customDetails && (
                        <p className="text-[11px] text-primary font-medium mt-1">
                          {item.customDetails.label}
                        </p>
                      )}

                      <p className="text-xs font-semibold text-primary sm:hidden mt-2">
                        একক মূল্য: {formatBengaliPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border-muted rounded-xl bg-surface-soft">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-main-muted hover:text-primary hover:bg-white rounded-l-xl transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 text-xs font-bold text-main-text font-sans">
                        {toBengaliNumber(item.quantity)}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-main-muted hover:text-primary hover:bg-white rounded-r-xl transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Total Item Price */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-base sm:text-lg font-bold text-primary block">
                        {formatBengaliPrice(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-main-subtle">
                          @{formatBengaliPrice(item.price)}
                        </span>
                      )}
                    </div>

                    {/* Remove Icon */}
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="p-2 text-main-subtle hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart link */}
            <div className="flex justify-between items-center px-2">
              <button
                onClick={clearCart}
                className="text-xs text-main-subtle hover:text-red-600 hover:underline transition-colors"
              >
                কার্ট খালি করুন
              </button>

              <span className="text-xs text-main-muted">
                🚚 ঢাকা শহরে ৩ ঘণ্টায় এক্সপ্রেস ডেলিভারি সুবিধা
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="card-luxury p-6 sm:p-7 shadow-soft space-y-5 bg-surface-white">
              <h2 className="text-lg font-bold text-main-text border-b border-border-subtle pb-3">
                অর্ডার সামারি
              </h2>

              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-accent-green-light border border-accent-green/30 text-xs text-accent-green">
                    <div className="flex items-center gap-1.5">
                      <Check size={15} />
                      <span>
                        কুপন <strong>{appliedCoupon.code}</strong> কার্যকর (-{formatBengaliPrice(discountAmount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-subtle" />
                        <input
                          type="text"
                          placeholder="কুপন কোড (যদি থাকে)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-surface-soft border border-border-muted rounded-xl text-xs text-main-text focus:outline-none focus:border-primary uppercase font-sans font-medium"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                      >
                        অ্যাপ্লাই
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-2.5 text-xs sm:text-sm text-main-muted border-t border-border-subtle pt-4">
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
                  <div className="flex justify-between text-accent-green font-semibold">
                    <span>কুপন ডিসকাউন্ট</span>
                    <span>-{formatBengaliPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-border-muted flex justify-between items-baseline">
                  <span className="text-base font-bold text-main-text">সর্বমোট</span>
                  <span className="text-2xl font-bold text-primary">{formatBengaliPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full btn-primary-burgundy py-3.5 text-base font-bold shadow-soft flex items-center justify-center gap-2"
              >
                <span>Checkout করুন</span>
                <ArrowRight size={18} />
              </button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-main-muted opacity-85">
                <ShieldCheck size={15} className="text-accent-green" />
                <span>🔒 নিরাপদ পেমেন্ট গ্যারান্টি</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
