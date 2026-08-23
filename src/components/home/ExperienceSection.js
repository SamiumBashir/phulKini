'use client';

import React from 'react';
import { Flower2, Truck, ShieldCheck, HeartHandshake, Sparkles, Clock } from 'lucide-react';

export default function ExperienceSection() {
  const perks = [
    {
      icon: Flower2,
      title: 'ফার্ম-ফ্রেশ ফুলের নিশ্চয়তা',
      desc: 'প্রতিদিন ভোরে সরাসরি নির্বাচিত ফ্লাওয়ার ফার্ম ও নেদারল্যান্ডসের অকশন থেকে ফুল সংগ্রহ করা হয়।'
    },
    {
      icon: Truck,
      title: '৩ ঘণ্টায় এক্সপ্রেস ডেলিভারি',
      desc: 'তাপমাত্রা নিয়ন্ত্রিত বিশেষ বাক্সে ডেলিভারি, যাতে ঢাকার যে প্রান্তেই হোক ফুল থাকে একদম সতেজ।'
    },
    {
      icon: HeartHandshake,
      title: 'হস্তশিল্প ও ভালোবাসা',
      desc: 'আমাদের অভিজ্ঞ মাস্টার ফ্লোরিস্টরা প্রতিটি তোড়া সাজান অত্যন্ত ভালোবাসা আর নিখুঁত শৈলীতে।'
    },
    {
      icon: Clock,
      title: 'মিডনাইট ও সেম-ডে ডেলিভারি',
      desc: 'রাত ১২:০০ টার সারপ্রাইজ ডেলিভারি কিংবা শেষ মুহূর্তের অর্ডার—সবকিছুতেই পাশে আছে ফুল কিনি।'
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-surface-soft/40 border-y border-border-subtle font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            কেন ফুল কিনি সেরা?
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-main-text mt-1">
            একটি প্রিমিয়াম ফ্লোরাল অভিজ্ঞতা
          </h2>
          <p className="text-xs sm:text-sm text-main-muted mt-2">
            আমরা শুধু ফুল বিক্রি করি না, আমরা পৌঁছে দিই আপনার সবচেয়ে বিশুদ্ধ আবেগ ও মধুর অনুভূতি।
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-surface-white border border-border-muted shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-base text-main-text mb-2">{perk.title}</h3>
                  <p className="text-xs text-main-muted leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
