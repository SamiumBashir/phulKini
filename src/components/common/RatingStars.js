'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { toBengaliNumber } from '@/utils/bengaliUtils';

export default function RatingStars({ rating = 5.0, count, size = 14, showText = true, compact = false }) {
  const rounded = Math.round(rating);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50/90 border border-amber-200/60 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap font-bengali">
        <Star size={11} className="fill-amber-400 text-amber-500 shrink-0" />
        <span>{toBengaliNumber(rating.toFixed(1))}</span>
        {count !== undefined && (
          <span className="text-amber-800/70 font-normal text-[10px]">
            ({toBengaliNumber(count)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-main-muted font-bengali shrink-0 whitespace-nowrap">
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
        <span className="font-semibold text-main-text text-xs whitespace-nowrap">
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
