'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import { toBengaliNumber } from '@/utils/bengaliUtils';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistView() {
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart, openCartDrawer } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => addToCart(item, 1));
    openCartDrawer();
  };

  if (wishlist.length === 0) {
    return (
      <div className="py-16 sm:py-24 max-w-container mx-auto px-4 md:px-8 text-center font-bengali">
        <div className="max-w-md mx-auto card-luxury p-8 sm:p-12 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-surface-soft border border-border-muted flex items-center justify-center text-4xl mb-2 text-primary">
            <Heart size={36} />
          </div>
          <h2 className="text-2xl font-bold text-main-text">
            আপনার উইশলিস্ট খালি ❤️
          </h2>
          <p className="text-xs sm:text-sm text-main-muted">
            পছন্দের ফুল ও তোড়াগুলো সংরক্ষণ করে রাখতে হার্ট আইকনে ক্লিক করুন।
          </p>
          <div className="pt-4">
            <Link href="/shop" className="btn-primary-burgundy text-sm py-3 px-8">
              ফুল দেখতে যান →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-border-subtle pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-main-text">
              পছন্দের তালিকা (Wishlist)
            </h1>
            <p className="text-xs sm:text-sm text-main-muted mt-1">
              মোট {toBengaliNumber(wishlistCount)}টি ফুল সংরক্ষিত আছে
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="btn-primary-burgundy text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <ShoppingBag size={14} />
              <span>সব কার্টে নিন</span>
            </button>
            <button
              onClick={clearWishlist}
              className="btn-secondary-outline text-xs py-2 px-4 text-main-muted border-border-muted hover:border-red-500 hover:text-red-600 flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>তালিকা খালি করুন</span>
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
