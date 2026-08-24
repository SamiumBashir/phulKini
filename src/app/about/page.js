import React from 'react';
import Link from 'next/link';
import { Flower2, Heart, Sparkles, ShieldCheck, MapPin, Users, Award, ArrowRight } from 'lucide-react';
import { toBengaliNumber } from '@/utils/bengaliUtils';

export const metadata = {
  title: 'আমাদের সম্পর্কে | ফুল কিনি',
  description: 'ফুল কিনি — ভালোবাসা হোক ফুলের ভাষায়। বাংলাদেশের আধুনিক ফ্লোরাল বুটিকের গল্প।'
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-16 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold">
            <Sparkles size={13} />
            আমাদের গল্প ও দর্শন
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-main-text leading-tight">
            ভালোবাসা হোক ফুলের ভাষায়
          </h1>
          <p className="text-sm sm:text-base text-main-muted leading-relaxed">
            “ফুল কিনি” হলো বাংলাদেশের একটি আধুনিক ও নান্দনিক ফ্লোরাল ব্র্যান্ড, যা তৈরি হয়েছে প্রতিটি সম্পর্কের বিশুদ্ধ অনুভূতি আর ভালোবাসাকে তাজা ফুলের সাজে ফুটিয়ে তোলার লক্ষ্য নিয়ে।
          </p>
        </div>

        {/* Split Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-sm sm:text-base text-main-muted leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold text-main-text leading-snug">
              ঐতিহ্য ও আধুনিকতার অনন্য মেলবন্ধন
            </h2>
            <p>
              আমরা বিশ্বাস করি ফুল শুধুমাত্র একটি উপহার নয়; এটি একটি অব্যাক্ত বার্তা, এক পশলা শান্তি এবং স্মৃতির মণিকোঠায় জমা হওয়া মধুর এক অনুভূতি।
            </p>
            <p>
              আমাদের যাত্রা শুরু হয়েছিল ফুলপ্রেমীদের জন্য একটি আন্তর্জাতিক মানের ফ্লোরাল শপ তৈরির স্বপ্ন নিয়ে। যশোরের গদখালীর ঐতিহ্যবাহী ফুলের মাঠ থেকে শুরু করে নেদারল্যান্ডসের বিখ্যাত ফ্লাওয়ার অকশন—সব জায়গা থেকে নিখুঁত ফুল সংগ্রহ করে আমাদের অভিজ্ঞ মাস্টার ফ্লোরিস্টরা তৈরি করেন অনিন্দ্য সুন্দর সব তোড়া।
            </p>
            <div className="p-4 rounded-2xl bg-surface-soft border border-border-muted italic text-main-text">
              “আমরা কোনো প্লাস্টিক বা কৃত্রিম ফুল বিক্রি করি না। প্রতিটি পাপড়িতে থাকে প্রাকৃতিক সুবাস আর খাঁটি সতেজতা।”
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border-2 border-border-muted shadow-soft-lg">
              <img
                src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000&auto=format&fit=crop"
                alt="Phul Kini Artisan Florist"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 rounded-3xl bg-surface-white border border-border-muted shadow-soft text-center">
          <div>
            <span className="text-2xl sm:text-4xl font-bold text-primary block font-sans">
              {toBengaliNumber('12500')}+
            </span>
            <span className="text-xs sm:text-sm text-main-muted mt-1 block">সফল ডেলিভারি</span>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-bold text-primary block font-sans">
              {toBengaliNumber('100')}%
            </span>
            <span className="text-xs sm:text-sm text-main-muted mt-1 block">তাজা ফুলের নিশ্চয়তা</span>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-bold text-primary block font-sans">
              {toBengaliNumber('3')}
            </span>
            <span className="text-xs sm:text-sm text-main-muted mt-1 block">ঢাকায় আউটলেট</span>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-bold text-primary block font-sans">
              ★ {toBengaliNumber('4.9')}
            </span>
            <span className="text-xs sm:text-sm text-main-muted mt-1 block">গ্রাহক সন্তুষ্টি</span>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-main-text">আমাদের মূলনীতি</h2>
            <p className="text-xs sm:text-sm text-main-muted mt-1">যা আমাদের অন্য সবার চেয়ে আলাদা করে তোলে</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-surface-white border border-border-muted shadow-soft-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                <Flower2 size={20} />
              </div>
              <h3 className="font-bold text-base text-main-text">ফার্ম-ফ্রেশ সততা</h3>
              <p className="text-xs text-main-muted leading-relaxed">
                প্রতিটি ফুল প্রতিদিন সকালে সতর্কতার সাথে বাছাই করা হয় যাতে ফুলদানিতে এটি দীর্ঘস্থায়ী হয়।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-white border border-border-muted shadow-soft-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-base text-main-text">লাক্সারি প্রেজেন্টেশন</h3>
              <p className="text-xs text-main-muted leading-relaxed">
                প্রিমিয়াম ভেলভেট পেপার, সাটিন রিবন এবং কাস্টমাইজড হস্তলিখিত উপহার কার্ডের আভিজাত্য।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-white border border-border-muted shadow-soft-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-base text-main-text">গ্রাহকের অনুভূতি প্রথম</h3>
              <p className="text-xs text-main-muted leading-relaxed">
                নির্দিষ্ট সময়ে নিখুঁত ডেলিভারি নিশ্চিত করতে আমাদের ডেডিকেটেড সাপোর্ট টিম সার্বক্ষণিক প্রস্তুত।
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/shop" className="btn-primary-burgundy text-sm py-3.5 px-8">
            <span>ফুলের কালেকশন দেখুন</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
