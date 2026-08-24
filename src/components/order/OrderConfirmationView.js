'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatBengaliPrice, toBengaliNumber, formatBengaliDate } from '@/utils/bengaliUtils';
import {
  CheckCircle2,
  Package,
  Truck,
  Heart,
  Clock,
  MapPin,
  Phone,
  Printer,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flower2
} from 'lucide-react';

export default function OrderConfirmationView() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('orderId');
  const { lastCompletedOrder } = useCart();

  const [order, setOrder] = useState(lastCompletedOrder);
  const [currentStep, setCurrentStep] = useState(2); // 1: Confirmed, 2: Preparing, 3: On the way, 4: Delivered

  useEffect(() => {
    if (!order) {
      try {
        const saved = localStorage.getItem('phul_kini_last_order');
        if (saved) {
          setOrder(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, [order]);

  // Fallback demo order if visited directly
  const orderDetails = order || {
    orderId: urlOrderId || 'PK-829415',
    createdAt: new Date().toISOString(),
    deliveryInfo: {
      fullName: 'রাফিদ হাসান',
      phone: '০১৭০০-০০০০০০',
      address: 'হাউজ ২৪, রোড ৭, ব্লক সি, বনানী, ঢাকা',
      area: 'বনানী',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliverySlot: 'morning',
      giftMessage: 'ভালোবাসা হোক ফুলের ভাষায়! শুভ জন্মদিন অনুষ্কা।'
    },
    items: [
      {
        cartId: 'midnight-romance',
        name: 'মিডনাইট রোমান্স',
        categoryName: 'প্রিমিয়াম রোজ',
        price: 3500,
        quantity: 1,
        images: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
        ]
      }
    ],
    subtotal: 3500,
    deliveryFee: 120,
    discountAmount: 350,
    grandTotal: 3270
  };

  const trackingSteps = [
    {
      id: 1,
      title: 'অর্ডার গৃহীত হয়েছে',
      subtitle: 'সিস্টেমে সফলভাবে এন্ট্রি সম্পন্ন',
      time: 'সকাল ৯:১৫',
      icon: CheckCircle2
    },
    {
      id: 2,
      title: 'ফ্লোরিস্ট তোড়া সাজাচ্ছেন',
      subtitle: 'তাজা ফুল নির্বাচন ও হস্তশিল্পে র‍্যাপিং',
      time: 'সকাল ৯:৪৫ (চলমান)',
      icon: Flower2
    },
    {
      id: 3,
      title: 'ডেলিভারির জন্য বের হয়েছে',
      subtitle: 'তাপমাত্রা নিয়ন্ত্রিত বিশেষ বাক্সে রাইডার',
      time: 'আনুমানিক সকাল ১০:৩০',
      icon: Truck
    },
    {
      id: 4,
      title: 'ডেলিভারি সম্পন্ন',
      subtitle: 'প্রিয়জনের হাতে উপহার প্রদান',
      time: 'আনুমানিক সকাল ১১:০০',
      icon: Heart
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-16 font-bengali">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Success Hero Card */}
        <div className="card-luxury p-8 text-center bg-surface-white space-y-4 border-2 border-primary/20 shadow-soft-lg">
          <div className="w-20 h-20 mx-auto rounded-full bg-accent-green-light text-accent-green flex items-center justify-center animate-scale-in shadow-sm">
            <CheckCircle2 size={44} />
          </div>

          <span className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full font-sans tracking-wide">
            অর্ডার আইডি: #{orderDetails.orderId}
          </span>

          <h1 className="text-2xl sm:text-4xl font-bold text-main-text">
            ধন্যবাদ! আপনার অর্ডার নিশ্চিত হয়েছে 🌸
          </h1>

          <p className="text-xs sm:text-sm text-main-muted max-w-md mx-auto leading-relaxed">
            আমরা আপনার অর্ডারটি অত্যন্ত যত্ন সহকারে প্রস্তুত করছি। ফুল ডেলিভারির প্রতিটি আপডেট আপনি লাইভ এখানে দেখতে পারবেন।
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="btn-secondary-outline text-xs py-2 px-5 flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>রসিদ প্রিন্ট করুন</span>
            </button>

            <Link
              href="/shop"
              className="btn-primary-burgundy text-xs py-2 px-5 flex items-center gap-1.5"
            >
              <ShoppingBag size={14} />
              <span>আরও শপিং করুন</span>
            </Link>
          </div>
        </div>

        {/* Live Order Tracking Timeline */}
        <div className="card-luxury p-6 sm:p-8 bg-surface-white space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-main-text">লাইভ অর্ডার ট্র্যাকিং</h2>
            </div>
            <span className="text-xs text-accent-green font-semibold bg-accent-green-light px-2.5 py-1 rounded-full">
              ● লাইভ আপডেট সক্রিয়
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {trackingSteps.map((step) => {
              const Icon = step.icon;
              const isPast = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary-subtle shadow-soft ring-2 ring-primary/20'
                      : isPast
                      ? 'border-accent-green/40 bg-accent-green-light/40 text-accent-green'
                      : 'border-border-subtle bg-surface-soft opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCurrent
                          ? 'bg-primary text-white'
                          : isPast
                          ? 'bg-accent-green text-white'
                          : 'bg-surface-white border border-border-muted text-main-muted'
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="text-[10px] text-main-subtle">{step.time}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-main-text leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-main-muted mt-1 leading-snug">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dedicated Florist & Rider Info Box */}
          <div className="p-4 rounded-2xl bg-surface-soft border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                💐
              </div>
              <div>
                <p className="font-bold text-main-text">মাস্টার ফ্লোরিস্ট: মেহজাবিন আহমেদ</p>
                <p className="text-main-muted text-[11px]">বনানী সেন্ট্রাল ফ্লোরাল স্টুডিও, ঢাকা</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-main-muted">জরুরি হেল্পলাইন:</span>
              <a
                href="tel:+8801700000000"
                className="font-bold text-primary hover:underline font-sans"
              >
                +8801700-000000
              </a>
            </div>
          </div>
        </div>

        {/* Invoice & Order Summary Details */}
        <div className="card-luxury p-6 sm:p-8 bg-surface-white space-y-6">
          <h2 className="text-lg font-bold text-main-text border-b border-border-subtle pb-3">
            অর্ডারের বিবরণ ও চালান
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Recipient & Delivery Info */}
            <div className="space-y-3 p-4 rounded-2xl bg-surface-soft border border-border-subtle">
              <h4 className="font-bold text-main-text text-xs uppercase tracking-wider text-primary">
                ডেলিভারি গন্তব্য
              </h4>
              <div className="space-y-1.5 text-main-muted">
                <p>
                  <strong className="text-main-text">প্রাপকের নাম:</strong> {orderDetails.deliveryInfo?.fullName}
                </p>
                <p>
                  <strong className="text-main-text">ফোন:</strong> {orderDetails.deliveryInfo?.phone}
                </p>
                <p>
                  <strong className="text-main-text">ঠিকানা:</strong> {orderDetails.deliveryInfo?.address}
                </p>
                <p>
                  <strong className="text-main-text">ডেলিভারি তারিখ:</strong>{' '}
                  {formatBengaliDate(orderDetails.deliveryInfo?.deliveryDate)}
                </p>
                {orderDetails.deliveryInfo?.giftMessage && (
                  <div className="mt-2 pt-2 border-t border-border-subtle">
                    <strong className="text-primary block mb-0.5">গ্রিটিং কার্ডে লিখিত বার্তা:</strong>
                    <p className="italic text-main-text">
                      “{orderDetails.deliveryInfo.giftMessage}”
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Items & Payment Info */}
            <div className="space-y-3 p-4 rounded-2xl bg-surface-soft border border-border-subtle">
              <h4 className="font-bold text-main-text text-xs uppercase tracking-wider text-primary">
                নির্বাচিত ফুল ও মূল্য
              </h4>
              <div className="space-y-2">
                {orderDetails.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-main-text">
                      {item.name} × {toBengaliNumber(item.quantity)}
                    </span>
                    <span className="font-semibold text-main-text">
                      {formatBengaliPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-border-subtle space-y-1 text-xs text-main-muted">
                  <div className="flex justify-between">
                    <span>সাবটোটাল</span>
                    <span>{formatBengaliPrice(orderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি ফি</span>
                    <span>
                      {orderDetails.deliveryFee === 0
                        ? 'ফ্রি'
                        : formatBengaliPrice(orderDetails.deliveryFee)}
                    </span>
                  </div>
                  {orderDetails.discountAmount > 0 && (
                    <div className="flex justify-between text-accent-green">
                      <span>ডিসকাউন্ট</span>
                      <span>-{formatBengaliPrice(orderDetails.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-primary pt-1 border-t border-border-subtle">
                    <span>সর্বমোট পরিশোধিত</span>
                    <span>{formatBengaliPrice(orderDetails.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
