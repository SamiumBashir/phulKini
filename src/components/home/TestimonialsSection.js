'use client';

import React from 'react';
import { TESTIMONIALS } from '@/data/testimonials';
import RatingStars from '@/components/common/RatingStars';
import { Quote, Sparkles, MapPin } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-20 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            গ্রাহকদের হৃদয়ছোঁয়া অভিজ্ঞতা
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-main-text">
            তারা ফুল কিনি সম্পর্কে কী বলছেন
          </h2>
          <p className="text-xs sm:text-sm text-main-muted mt-2">
            হাজারো সুখী গ্রাহকের ভালোবাসাই আমাদের প্রতিদিনের অনুপ্রেরণা।
          </p>
        </div>

        {/* 3 Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="card-luxury p-6 flex flex-col justify-between relative bg-surface-white"
            >
              <div>
                <Quote size={28} className="text-primary-light mb-3" />
                <RatingStars rating={review.rating} size={15} showText={false} />
                <p className="text-xs sm:text-sm text-main-text italic mt-3 leading-relaxed">
                  “{review.comment}”
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-border-subtle">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border border-border-muted"
                />
                <div>
                  <h4 className="font-bold text-sm text-main-text">{review.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-main-muted">
                    <MapPin size={11} className="text-primary" />
                    <span>{review.location}</span>
                  </div>
                  <span className="text-[10px] text-primary font-medium mt-0.5 inline-block">
                    পণ্য: {review.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
