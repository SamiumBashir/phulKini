'use client';

import React from 'react';
import Link from 'next/link';
import { OCCASIONS } from '@/data/occasions';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OccasionGrid() {
  return (
    <section className="py-12 sm:py-20 bg-surface-soft/60 border-y border-border-subtle font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
            <Sparkles size={13} />
            উপলক্ষভিত্তিক কিউরেশন
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-main-text">
            কোন উপলক্ষের জন্য?
          </h2>
          <p className="text-xs sm:text-sm text-main-muted mt-2">
            প্রতিটি সম্পর্কের জন্য এবং প্রতিটি বিশেষ মুহূর্তের জন্য আমাদের রয়েছে আলাদা আয়োজন।
          </p>
        </div>

        {/* Occasion Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {OCCASIONS.map((occasion) => (
            <Link
              key={occasion.id}
              href={`/shop?occasion=${occasion.recommendedTag}`}
              className="group card-luxury overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 relative"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft">
                <img
                  src={occasion.image}
                  alt={occasion.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Floating Content over Image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xl mb-1 block">{occasion.icon}</span>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {occasion.title}
                  </h3>
                  <p className="text-[10px] text-white/70 font-sans mt-0.5">
                    {occasion.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
