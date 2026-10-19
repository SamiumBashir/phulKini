'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { toBengaliNumber } from '@/utils/bengaliUtils';

export default function RatingStars({ rating = 5.0, count, size = 14, showText = true, compact = false }) {
  const rounded = Math.round(rating);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-md shrink-0 font-bengali">
        <Star size={11} className="fill-amber-400 text-amber-500 shrink-0" />
        <span className="leading-none">{toBengaliNumber(rating.toFixed(1))}</span>
        {count !== undefined && (
          <span className="text-main-muted font-normal text-[10px] hidden sm:inline ml-0.5 leading-none">
            ({toBengaliNumber(count)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-main-muted font-bengali shrink-0">
      <div className="flex items-center text-amber-500 shrink-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rounded ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="font-semibold text-main-text text-xs shrink-0 whitespace-nowrap">
          {toBengaliNumber(rating.toFixed(1))}
          {count !== undefined && (
            <span className="text-main-muted font-normal ml-0.5">
              ({toBengaliNumber(count)})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
