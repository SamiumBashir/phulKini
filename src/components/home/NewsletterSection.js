'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন', 'error');
      return;
    }

    setIsSubscribed(true);
    addToast('অভিনন্দন! ১০% ডিসকাউন্ট ভাউচার আপনার ইমেইলে পাঠানো হয়েছে 🎉', 'success');
  };

  return (
    <section className="py-12 sm:py-16 bg-primary-subtle border-t border-border-muted font-bengali">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-white border border-border-muted text-primary text-xs font-semibold">
          <Sparkles size={13} />
          বিশেষ উপহার ও অফার
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-main-text">
          প্রথম অর্ডারে পান ১০% ছাড়ের কুপন
        </h2>

        <p className="text-xs sm:text-sm text-main-muted max-w-lg mx-auto leading-relaxed">
          আমাদের নিউজলেটারে সাবস্ক্রাইব করে যুক্ত থাকুন নতুন ফুলের কালেকশন, মৌসুমী অফার আর স্পেশাল ডিসকাউন্ট কোডের সাথে।
        </p>

        {isSubscribed ? (
          <div className="p-4 rounded-2xl bg-accent-green-light border border-accent-green/30 text-accent-green text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            <span>ধন্যবাদ! আপনার কুপন কোড: <strong className="font-mono font-sans text-primary">PHUL10</strong></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-subtle" />
              <input
                type="email"
                placeholder="আপনার ইমেইল ঠিকানা লিখুন..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-white border border-border-muted rounded-full text-xs sm:text-sm text-main-text placeholder:text-main-subtle focus:outline-none focus:border-primary shadow-soft-sm"
              />
            </div>
            <button
              type="submit"
              className="btn-primary-burgundy text-xs sm:text-sm py-3 px-6 shrink-0 shadow-soft"
            >
              কুপন পান →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
