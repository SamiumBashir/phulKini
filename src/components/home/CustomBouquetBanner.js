'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Palette, Flower2, Gift, CheckCircle2 } from 'lucide-react';

export default function CustomBouquetBanner() {
  return (
    <section className="py-12 sm:py-20 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-[#2D0B0B] text-white p-8 sm:p-14 border border-primary-container shadow-soft-xl">
          
          {/* Subtle Ambient Floral Background Overlay */}
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1200&auto=format&fit=crop')"
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary text-primary-light text-xs font-semibold uppercase tracking-wider border border-primary-light/20">
                <Sparkles size={14} className="text-amber-300" />
                এক্সক্লুসিভ ফিচার
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                নিজের মতো করে <br />
                <span className="text-pink-300">তোড়া বানান</span>
              </h2>

              <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed max-w-xl">
                “আপনার পছন্দের ফুল, রঙ ও বাজেট অনুযায়ী তৈরি করুন আপনার নিজের বিশেষ তোড়া।” আমাদের ৮-ধাপের কাস্টমাইজার দিয়ে নিজের মনের মাধুরী মিশিয়ে সাজান প্রিয়জনের জন্য উপহার।
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-pink-100/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-pink-300 shrink-0" />
                  <span>গোলাপ, লিলি, টিউলিপ বাছাই</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-pink-300 shrink-0" />
                  <span>লাক্সারি ভেলভেট ও ক্রাফট র‍্যাপিং</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-pink-300 shrink-0" />
                  <span>চকলেট ও ক্যান্ডেল অ্যাড-অন</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-pink-300 shrink-0" />
                  <span>হাতে লেখা ফ্রি গ্রিটিং কার্ড</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Link
                  href="/custom-bouquet"
                  className="inline-flex items-center gap-2 bg-white hover:bg-pink-50 text-primary font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-soft-lg transition-transform hover:scale-105"
                >
                  <span>তোড়া কাস্টমাইজ করুন</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right Visual Interactive Card (5 cols) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-soft-lg space-y-4">
                <div className="flex items-center justify-between text-xs text-pink-200">
                  <span className="font-semibold">লাইভ ফ্লোরিস্ট প্রিভিউ</span>
                  <span>৮টি সহজ ধাপ</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10">
                    <Flower2 size={18} className="text-pink-300" />
                    <div className="text-xs">
                      <p className="font-bold text-white">১. পছন্দসই তাজা ফুল</p>
                      <p className="text-pink-200/70 text-[11px]">ডাচ রোজ, লিলি, টিউলিপ</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10">
                    <Palette size={18} className="text-amber-300" />
                    <div className="text-xs">
                      <p className="font-bold text-white">২. সিগনেচার কালার থিম</p>
                      <p className="text-pink-200/70 text-[11px]">বার্গান্ডি, প্যাস্টেল পিংক, হোয়াইট</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10">
                    <Gift size={18} className="text-emerald-300" />
                    <div className="text-xs">
                      <p className="font-bold text-white">৩. লাক্সারি উপহার ও চিঠি</p>
                      <p className="text-pink-200/70 text-[11px]">বেলজিয়ান চকলেট ও সয়া ক্যান্ডেল</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-pink-200/80">
                    ✨ প্রতি অর্ডারে ফ্রি প্রিমিয়াম হ্যান্ডরিটেন গ্রিটিং কার্ড
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
