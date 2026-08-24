'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatBengaliPrice, toBengaliNumber, DELIVERY_SLOTS } from '@/utils/bengaliUtils';
import confetti from 'canvas-confetti';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Wallet
} from 'lucide-react';

export default function CheckoutView() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    clearCart,
    setLastCompletedOrder
  } = useCart();
  const { addToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    address: '',
    city: 'ঢাকা',
    area: 'বনানী',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliverySlot: 'morning',
    giftMessage: '',
    instructions: '',
    paymentMethod: 'bkash', // 'bkash', 'nagad', 'card', 'cod'
    bkashNumber: '',
    nagadNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentOptions = [
    {
      id: 'bkash',
      name: 'বিকাশ (bKash)',
      subtitle: 'মোবাইল ব্যাংকিং (অটোমেটেড পেমেন্ট)',
      badge: 'জনপ্রিয়',
      color: '#E2136E',
      icon: '📱'
    },
    {
      id: 'nagad',
      name: 'নগদ (Nagad)',
      subtitle: 'মোবাইল ব্যাংকিং',
      badge: 'ইনস্ট্যান্ট',
      color: '#F7941D',
      icon: '⚡'
    },
    {
      id: 'card',
      name: 'কার্ড পেমেন্ট',
      subtitle: 'ভিসা, মাস্টারকার্ড ও অ্যামেক্স',
      badge: 'নিরাপদ',
      color: '#1A1F71',
      icon: '💳'
    },
    {
      id: 'cod',
      name: 'ক্যাশ অন ডেলিভারি',
      subtitle: 'পণ্য হাতে পেয়ে টাকা দিন',
      badge: 'সহজ',
      color: '#374639',
      icon: '💵'
    }
  ];

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'আপনার পূর্ণ নাম লিখুন';
    if (!formData.phone.trim() || formData.phone.length < 11) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)';
    }
    if (!formData.address.trim()) errs.address = 'বিস্তারিত ডেলিভারি ঠিকানা লিখুন';
    if (!formData.deliveryDate) errs.deliveryDate = 'ডেলিভারি তারিখ নির্বাচন করুন';

    if (formData.paymentMethod === 'bkash' && !formData.bkashNumber) {
      errs.bkashNumber = 'বিকাশ ওয়ালেট নম্বর লিখুন';
    }
    if (formData.paymentMethod === 'nagad' && !formData.nagadNumber) {
      errs.nagadNumber = 'নগদ ওয়ালেট নম্বর লিখুন';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderId = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      items: [...items],
      subtotal,
      deliveryFee,
      discountAmount,
      grandTotal,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      deliveryInfo: { ...formData },
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    setTimeout(() => {
      // Save order
      setLastCompletedOrder(newOrder);
      try {
        localStorage.setItem('phul_kini_last_order', JSON.stringify(newOrder));
      } catch (e) {}

      // Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      clearCart();
      setIsSubmitting(false);
      addToast('আপনার অর্ডার সফলভাবে গৃহীত হয়েছে! 🌸', 'success');
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-container mx-auto px-4 text-center font-bengali">
        <div className="max-w-md mx-auto card-luxury p-8 space-y-4">
          <h2 className="text-xl font-bold text-main-text">কোনো পণ্য কার্টে নেই</h2>
          <p className="text-xs text-main-muted">চেকআউট করতে প্রথমে কিছু ফুল পছন্দ করুন।</p>
          <Link href="/shop" className="btn-primary-burgundy text-xs py-2.5 px-6 inline-block">
            ফুল শপে যান →
          </Link>
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
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">
              নিরাপদ পেমেন্ট
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-main-text mt-0.5">
              চেকআউট
            </h1>
            <p className="text-xs sm:text-sm text-main-muted mt-1">
              নিরাপদ এবং দ্রুত পেমেন্ট সম্পন্ন করুন
            </p>
          </div>

          <Link
            href="/cart"
            className="text-xs sm:text-sm text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>কার্টে ফিরে যান</span>
          </Link>
        </div>

        {/* 2-Column Responsive Checkout Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Info & Payment Methods (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Delivery Information */}
            <div className="card-luxury p-6 sm:p-7 space-y-5 bg-surface-white">
              <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary">
                  <Truck size={17} />
                </div>
                <h2 className="text-lg font-bold text-main-text">
                  ১. ডেলিভারি তথ্য
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-main-text mb-1">
                    পূর্ণ নাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="আপনার পুরো নাম লিখুন"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full p-3 bg-surface-soft border rounded-xl text-main-text focus:outline-none focus:border-primary ${
                      errors.fullName ? 'border-red-500 bg-red-50' : 'border-border-muted'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone & Alt Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      ফোন নম্বর <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="০১৭১১-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full p-3 bg-surface-soft border rounded-xl text-main-text font-sans focus:outline-none focus:border-primary ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-border-muted'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      বিকল্প ফোন নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      placeholder="জরুরি যোগাযোগের জন্য"
                      value={formData.altPhone}
                      onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block font-semibold text-main-text mb-1">
                    ডেলিভারি ঠিকানা <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="বিস্তারিত ঠিকানা (বাড়ি নম্বর, ফ্ল্যাট, রোড, এলাকা)"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full p-3 bg-surface-soft border rounded-xl text-main-text focus:outline-none focus:border-primary resize-none ${
                      errors.address ? 'border-red-500 bg-red-50' : 'border-border-muted'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Area & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      এলাকা (ঢাকা সিটি)
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="বনানী">বনানী</option>
                      <option value="গুলশান-১">গুলশান-১</option>
                      <option value="গুলশান-২">গুলশান-২</option>
                      <option value="ধানমন্ডি">ধানমন্ডি</option>
                      <option value="উত্তরা">উত্তরা</option>
                      <option value="মিরপুর">মিরপুর</option>
                      <option value="বসুন্ধরা আবাসিক">বসুন্ধরা আবাসিক</option>
                      <option value="মতিঝিল / পুরান ঢাকা">মতিঝিল / পুরান ঢাকা</option>
                      <option value="অন্যান্য এলাকা">অন্যান্য এলাকা</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      ডেলিভারি তারিখ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Delivery Time Slot */}
                <div>
                  <label className="block font-semibold text-main-text mb-1.5">
                    ডেলিভারি সময় স্লট <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {DELIVERY_SLOTS.map((slot) => (
                      <label
                        key={slot.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.deliverySlot === slot.id
                            ? 'border-primary bg-primary-light/40 text-primary font-semibold'
                            : 'border-border-subtle bg-surface-soft text-main-muted'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliverySlot"
                          checked={formData.deliverySlot === slot.id}
                          onChange={() => setFormData({ ...formData, deliverySlot: slot.id })}
                          className="mt-0.5 accent-primary"
                        />
                        <div>
                          <span className="block text-xs font-bold text-main-text">{slot.tag}</span>
                          <span className="block text-[11px] text-main-subtle">{slot.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Optional Message on Card */}
                <div>
                  <label className="block font-semibold text-main-text mb-1">
                    গ্রিটিং কার্ড বার্তা (ফ্রি হস্তলিপিকৃত কার্ড)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="প্রিয়জনের জন্য মিষ্টি কোনো ভালোবাসার বার্তা..."
                    value={formData.giftMessage}
                    onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                    className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Methods */}
            <div className="card-luxury p-6 sm:p-7 space-y-5 bg-surface-white">
              <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary">
                  <CreditCard size={17} />
                </div>
                <h2 className="text-lg font-bold text-main-text">
                  ২. পেমেন্ট পদ্ধতি
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {paymentOptions.map((opt) => {
                  const isSelected = formData.paymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: opt.id })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary-subtle shadow-soft ring-2 ring-primary/20'
                          : 'border-border-subtle bg-surface-soft hover:border-border-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <h3 className="font-bold text-sm text-main-text">{opt.name}</h3>
                            <p className="text-[11px] text-main-muted">{opt.subtitle}</p>
                          </div>
                        </div>

                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isSelected}
                          onChange={() => setFormData({ ...formData, paymentMethod: opt.id })}
                          className="accent-primary mt-1"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulated Mobile Banking Inputs */}
              {formData.paymentMethod === 'bkash' && (
                <div className="p-4 rounded-2xl bg-[#E2136E]/10 border border-[#E2136E]/30 space-y-2 text-xs animate-fade-in">
                  <span className="font-bold text-[#E2136E]">বিকাশ পেমেন্ট গেটওয়ে:</span>
                  <p className="text-main-muted">
                    আপনার বিকাশ অ্যাকাউন্ট নম্বর লিখুন। অর্ডার কনফার্ম করার পর বিকাশ সুরক্ষিত গেটওয়েতে রিডাইরেক্ট হবে।
                  </p>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.bkashNumber}
                    onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                    className="w-full p-2.5 bg-white border border-border-muted rounded-xl font-sans"
                  />
                  {errors.bkashNumber && (
                    <p className="text-[11px] text-red-600">{errors.bkashNumber}</p>
                  )}
                </div>
              )}

              {formData.paymentMethod === 'nagad' && (
                <div className="p-4 rounded-2xl bg-[#F7941D]/10 border border-[#F7941D]/30 space-y-2 text-xs animate-fade-in">
                  <span className="font-bold text-[#F7941D]">নগদ পেমেন্ট গেটওয়ে:</span>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.nagadNumber}
                    onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                    className="w-full p-2.5 bg-white border border-border-muted rounded-xl font-sans"
                  />
                  {errors.nagadNumber && (
                    <p className="text-[11px] text-red-600">{errors.nagadNumber}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Checkout Order Summary (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="card-luxury p-6 sm:p-7 shadow-soft space-y-5 bg-surface-white">
              <h2 className="text-lg font-bold text-main-text border-b border-border-subtle pb-3">
                অর্ডার সামারি
              </h2>

              {/* Product Thumbnails List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-border-subtle">
                {items.map((item) => (
                  <div key={item.cartId} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.images ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-border-subtle shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-main-text line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-main-muted">
                        পরিমাণ: {toBengaliNumber(item.quantity)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {formatBengaliPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs sm:text-sm text-main-muted border-t border-border-subtle pt-4">
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

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary-burgundy py-3.5 text-base font-bold shadow-soft flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <span>অর্ডার কনফার্ম করুন</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-main-muted space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-accent-green font-medium">
                  <Lock size={13} />
                  <span>🔒 নিরাপদ 256-bit এনক্রিপশন পেমেন্ট</span>
                </div>
                <p className="text-[10px] text-main-subtle">
                  অর্ডার কনফার্ম করার সাথে সাথে ফোনে কনফার্মেশন এসএমএস পাবেন।
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
