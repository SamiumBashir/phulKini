'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { toBengaliNumber } from '@/utils/bengaliUtils';

export default function RatingStars({ rating = 5.0, count, size = 14, showText = true }) {
  const rounded = Math.round(rating);

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-main-muted font-bengali">
      <div className="flex items-center text-amber-500">
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
        <span className="font-semibold text-main-text text-xs">
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
