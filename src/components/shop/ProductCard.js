'use client';

import React, { useState } from 'react';
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
      className="group card-luxury overflow-hidden flex flex-col justify-between cursor-pointer font-bengali"
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
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm tracking-tight font-sans">
              -{toBengaliNumber(product.discountPercent)}%
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm">
              বেস্টসেলার ✨
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm">
              নতুন কালেকশন
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white/90 text-main-muted hover:text-primary hover:bg-white shadow-sm'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
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
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium text-main-subtle">
              {product.categoryName}
            </span>
            <RatingStars rating={product.rating} count={product.reviewsCount} />
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-main-text group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-main-muted line-clamp-2 mt-1 leading-relaxed opacity-85">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base md:text-lg text-primary">
                {formatBengaliPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-main-subtle line-through opacity-70">
                  {formatBengaliPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isAdded
                ? 'bg-accent-green text-white scale-95'
                : 'bg-primary-light hover:bg-primary text-primary hover:text-white'
            }`}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span>যুক্ত হয়েছে</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>কার্টে নিন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
