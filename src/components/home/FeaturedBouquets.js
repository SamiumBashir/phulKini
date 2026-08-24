'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedBouquets() {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Show bestsellers first or active catalog slice
  const featuredProducts = products.filter((p) => p.isBestseller).length > 0
    ? products.filter((p) => p.isBestseller).slice(0, 8)
    : products.slice(0, 8);

  return (
    <section className="py-12 sm:py-20 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold tracking-wider uppercase mb-1">
              <Sparkles size={13} />
              <span>আমাদের সিগনেচার কালেকশন</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-main-text">
              জনপ্রিয় ফুলের তোড়া
            </h2>
            <p className="text-xs sm:text-sm text-main-muted mt-1">
              সবচেয়ে বেশি প্রশংসিত এবং উপহার হিসেবে গ্রাহকদের প্রথম পছন্দ।
            </p>
          </div>

          <Link
            href="/shop"
            className="btn-secondary-outline text-xs sm:text-sm py-2 px-5 group"
          >
            <span>সব ফুল দেখুন</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid (4 columns on desktop, 3 on tablet, 2 on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        {/* Bottom Banner inside Section */}
        <div className="mt-12 p-6 rounded-3xl bg-primary-subtle border border-border-muted flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg text-primary">
              আপনার বিশেষ কোনো পছন্দ আছে কি?
            </h3>
            <p className="text-xs text-main-muted">
              নিজের মনের মতো ফুল ও কালার মিলিয়ে কাস্টমাইজড তোড়া তৈরি করতে পারেন মাত্র কয়েক মিনিটে।
            </p>
          </div>

          <Link
            href="/custom-bouquet"
            className="btn-primary-burgundy text-xs sm:text-sm py-2.5 px-6 shrink-0"
          >
            তোড়া কাস্টমাইজ করুন →
          </Link>
        </div>
      </div>

      {/* Quick View / Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
