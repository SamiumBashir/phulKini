'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import RatingStars from '@/components/common/RatingStars';
import { Heart, ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [imgHover, setImgHover] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group card-luxury overflow-hidden flex flex-col justify-between cursor-pointer font-bengali h-full"
    >
      {/* Product Image Container */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-surface-soft"
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
      >
        <img
          src={
            imgHover && product.images && product.images.length > 1
              ? product.images[1]
              : product.images[0]
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none items-start">
          {product.discountPercent > 0 && (
            <span className="bg-primary text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm tracking-tight font-sans whitespace-nowrap">
              -{toBengaliNumber(product.discountPercent)}%
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-100/95 text-amber-900 border border-amber-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm whitespace-nowrap">
              বেস্টসেলার ✨
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-100/95 text-emerald-900 border border-emerald-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm whitespace-nowrap">
              নতুন কালেকশন
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white/90 text-main-muted hover:text-primary hover:bg-white shadow-sm'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={15} className={isFavorite ? 'fill-white' : ''} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-3 px-3 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
            className="w-full bg-surface-white/95 hover:bg-surface-white text-main-text text-xs font-semibold py-2 rounded-xl shadow-soft flex items-center justify-center gap-1.5 transition-all border border-border-muted"
          >
            <Eye size={14} className="text-primary" />
            <span>বিস্তারিত দেখুন</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1.5 mb-1 min-w-0">
            <span className="text-[11px] font-medium text-main-subtle truncate max-w-[55%]">
              {product.categoryName}
            </span>
            <div className="shrink-0">
              <div className="hidden lg:block">
                <RatingStars rating={product.rating} count={product.reviewsCount} size={12} />
              </div>
              <div className="block lg:hidden">
                <RatingStars rating={product.rating} count={product.reviewsCount} compact />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-main-text group-hover:text-primary transition-colors leading-snug line-clamp-1">
            <Link
              href={`/product/${product.slug || product.id}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="hover:underline focus:outline-none"
            >
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-main-muted line-clamp-2 mt-1 leading-relaxed opacity-85">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 sm:pt-2.5 border-t border-border-subtle flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="font-bold text-sm sm:text-base md:text-lg text-primary whitespace-nowrap">
                {formatBengaliPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-main-subtle line-through opacity-70 whitespace-nowrap">
                  {formatBengaliPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`shrink-0 rounded-full font-semibold flex items-center justify-center transition-all duration-200 shadow-soft-sm ${
              isAdded
                ? 'bg-accent-green text-white p-2 sm:px-3 sm:py-1.5 text-xs'
                : 'bg-primary-light hover:bg-primary text-primary hover:text-white p-2 sm:px-3 sm:py-1.5 text-xs'
            }`}
            aria-label={isAdded ? 'কার্টে যুক্ত হয়েছে' : 'কার্টে নিন'}
            title={isAdded ? 'কার্টে যুক্ত হয়েছে' : 'কার্টে যোগ করুন'}
          >
            {isAdded ? (
              <>
                <Check size={14} className="shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap ml-1 font-medium">যুক্ত হয়েছে</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap ml-1 font-medium">কার্টে নিন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
