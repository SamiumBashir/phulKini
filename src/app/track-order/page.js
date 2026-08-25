'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError('অর্ডার নম্বর এবং ফোন নম্বর উভয়ই পূরণ করুন');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          phone: phone.trim()
        })
      });

      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.message || 'উক্ত তথ্যে কোনো অর্ডার পাওয়া যায়নি');
      }
    } catch (err) {
      setError('ট্র্যাকিং সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PENDING':
        return 0;
      case 'PROCESSING':
      case 'READY_FOR_DELIVERY':
        return 1;
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  const steps = [
    { label: 'অর্ডার কনফার্মড', desc: 'অর্ডার গ্রহণ করা হয়েছে' },
    { label: 'তোড়া তৈরি হচ্ছে', desc: 'আর্টিসান ফ্লোরিস্ট সাজাচ্ছেন' },
    { label: 'রাইডার পথে রয়েছে', desc: 'এক্সপ্রেস ডেলিভারি ভ্যানে' },
    { label: 'ডেলিভারি সম্পন্ন', desc: 'প্রিয়জনের হাতে পৌঁছেছে' }
  ];

  return (
    <div className="py-12 sm:py-16 font-bengali min-h-[85vh]">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-sm">
            <Truck size={28} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-main-text">
            লাইভ অর্ডার ট্র্যাকিং
          </h1>
          <p className="text-xs sm:text-sm text-main-muted max-w-md mx-auto">
            আপনার ফুল ও তোড়া কখন পৌঁছাবে তা জানতে অর্ডার নম্বর ও মোবাইল নম্বর দিয়ে সার্চ করুন
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="card-luxury p-6 sm:p-8 bg-white border border-[#E8DDD9] shadow-soft mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-main-text mb-1.5">
                  অর্ডার নম্বর
                </label>
                <input
                  type="text"
                  placeholder="যেমন: PK-481920"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-xs sm:text-sm text-main-text font-sans focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main-text mb-1.5">
                  অর্ডারে ব্যবহৃত মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-xs sm:text-sm text-main-text font-sans focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary-burgundy py-3.5 rounded-xl text-sm font-bold shadow-soft flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>তথ্য অনুসন্ধান হচ্ছে...</span>
                </span>
              ) : (
                <>
                  <Search size={16} />
                  <span>অর্ডার ট্র্যাক করুন</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Tracking Result View */}
        {order && (
          <div className="card-luxury p-6 sm:p-8 bg-white border border-[#E8DDD9] shadow-luxury space-y-8 animate-fade-in">
            
            {/* Top Order Summary Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0E6E3] pb-6">
              <div>
                <span className="text-xs text-primary font-bold tracking-wider uppercase font-sans">
                  {order.orderNumber}
                </span>
                <h2 className="text-lg font-bold text-main-text mt-0.5">
                  প্রাপক: {order.recipientName}
                </h2>
                <p className="text-xs text-main-muted">
                  এলাকা: {order.area} • ডেলিভারি স্লট: {order.timeSlot}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary/20">
                  {order.status}
                </span>
              </div>
            </div>

            {/* 4-Stage Visual Timeline */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          isCompleted
                            ? 'bg-primary text-white shadow-soft ring-4 ring-primary/20'
                            : 'bg-[#FCF9F8] border-2 border-[#D9C8C4] text-main-muted'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={18} /> : toBengaliNumber(idx + 1)}
                      </div>
                      <h4
                        className={`text-xs font-bold mt-2.5 ${
                          isCurrent ? 'text-primary' : isCompleted ? 'text-main-text' : 'text-main-muted'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-main-muted mt-0.5">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items Preview */}
            <div className="border-t border-[#F0E6E3] pt-6 space-y-3">
              <h3 className="text-xs font-bold text-main-text uppercase tracking-wider">
                অর্ডারের ফুল ও উপহার সামগ্রী
              </h3>
              <div className="divide-y divide-[#F0E6E3]">
                {order.items.map((item, i) => (
                  <div key={i} className="py-3 first:pt-0 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8DDD9]"
                        />
                      )}
                      <div>
                        <span className="font-bold text-main-text block">{item.name}</span>
                        <span className="text-xs text-main-muted">পরিমাণ: {toBengaliNumber(item.quantity)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">
                      {formatBengaliPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#F0E6E3] flex justify-between items-baseline">
                <span className="text-sm font-bold text-main-text">সর্বমোট বিল</span>
                <span className="text-xl font-bold text-primary">
                  {formatBengaliPrice(order.pricing.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
