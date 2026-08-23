'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { toBengaliNumber } from '@/utils/bengaliUtils';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategorySection() {
  return (
    <section className="py-12 sm:py-16 bg-surface-soft/60 border-y border-border-subtle font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold tracking-wider uppercase mb-1">
              <Sparkles size={13} />
              <span>আমাদের এক্সক্লুসিভ ভ্যারাইটি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-main-text">
              ফুলের কালেকশন
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 group"
          >
            <span>সব কালেকশন দেখুন</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.slug === 'all' ? '/shop' : `/shop?category=${category.slug}`}
              className="group card-luxury overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-soft">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <span className="absolute bottom-2.5 left-3 text-lg">
                  {category.icon}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-3 sm:p-4 bg-surface-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-main-text group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-[11px] text-main-subtle font-sans">
                    {toBengaliNumber(category.count)}+ আইটেম
                  </span>
                </div>
                <p className="text-[11px] text-main-muted line-clamp-1 mt-0.5 opacity-80">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
