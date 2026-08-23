'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Heart, Star, Flower2 } from 'lucide-react';
import { toBengaliNumber } from '@/utils/bengaliUtils';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pb-20 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light/80 border border-primary-light text-primary text-xs sm:text-sm font-semibold animate-fade-in shadow-soft-sm">
              <Sparkles size={14} className="text-primary animate-pulse-subtle" />
              <span>তাজা ফুল, সুন্দর অনুভূতি</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-main-text leading-[1.18] tracking-tight">
              “ভালোবাসা হোক <br className="hidden sm:block" />
              <span className="text-primary relative inline-block">
                ফুলের ভাষায়
                <svg
                  className="absolute -bottom-2 left-0 w-full text-border-muted"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 3 190 3 247 9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>”
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-main-muted leading-relaxed max-w-xl">
              আপনার প্রিয় মানুষটির জন্য বেছে নিন সতেজ ফুল, সুন্দর তোড়া আর হৃদয়ছোঁয়া উপহার। প্রতিদিন সকালে সংগৃহীত ১০০% তাজা ফুল পৌঁছে দিচ্ছি সমগ্র ঢাকায়।
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/shop"
                className="btn-primary-burgundy text-sm sm:text-base py-3.5 px-8 shadow-soft-lg group"
              >
                <span>ফুল কিনুন</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/custom-bouquet"
                className="btn-secondary-outline text-sm sm:text-base py-3.5 px-7 hover:shadow-soft"
              >
                <Sparkles size={16} className="text-primary" />
                <span>তোড়া কাস্টমাইজ করুন</span>
              </Link>
            </div>

            {/* Value Props Row */}
            <div className="pt-6 border-t border-border-subtle grid grid-cols-3 gap-3 max-w-lg text-xs sm:text-sm text-main-muted">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Truck size={14} />
                </span>
                <span className="font-medium leading-snug">৩ ঘণ্টায় এক্সপ্রেস ডেলিভারি</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Flower2 size={14} />
                </span>
                <span className="font-medium leading-snug">১০০% ফার্ম ফ্রেশ ফুলের গ্যারান্টি</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} />
                </span>
                <span className="font-medium leading-snug">নিরাপদ ও যত্নশীল প্যাকেজিং</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Bouquet Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Bouquet Card */}
              <div className="relative rounded-[28px] overflow-hidden border-2 border-border-muted bg-surface-white shadow-soft-xl group">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"
                  alt="Phul Kini Signature Bouquet"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  priority="true"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] bg-primary/90 text-primary-light px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold font-sans">
                    সিগনেচার বুটিক কালেকশন
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1.5">মিডনাইট রোমান্স বুকে</h3>
                  <p className="text-xs text-white/80 mt-0.5">ডাচ লাল গোলাপ ও সুবাসিত জিপসি ফ্লাওয়ার</p>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-surface-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-border-muted shadow-soft-lg flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  ★ ৪.৯
                </div>
                <div>
                  <div className="flex items-center text-amber-400 text-xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-main-text mt-0.5">
                    {toBengaliNumber(12500)}+ উপহার পৌঁছেছে
                  </p>
                  <p className="text-[10px] text-main-subtle">বিশ্বস্ত গ্রাহক সন্তুষ্টি</p>
                </div>
              </div>

              {/* Floating Freshness Tag */}
              <div className="absolute -top-4 -right-3 sm:-right-4 bg-surface-white p-3 rounded-2xl border border-border-muted shadow-soft flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-main-text">আজকের স্টক সতেজ 🌿</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
