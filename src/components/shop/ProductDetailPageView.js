'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatBengaliPrice, toBengaliNumber, formatBengaliDate, DELIVERY_SLOTS } from '@/utils/bengaliUtils';
import RatingStars from '@/components/common/RatingStars';
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Calendar,
  Clock,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';

export default function ProductDetailPageView({ productId }) {
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product =
    products.find((p) => p.slug === productId || p.id === productId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [giftMessage, setGiftMessage] = useState('');
  const [selectedQuickView, setSelectedQuickView] = useState(null);

  if (!product) {
    return (
      <div className="py-20 text-center font-bengali text-main-muted">
        <p className="text-base font-semibold">পণ্যটি খুঁজে পাওয়া যায়নি</p>
        <Link href="/shop" className="btn-primary-burgundy text-xs py-2 px-5 mt-3 inline-block">
          সব ফুল দেখুন
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (openDrawer = true) => {
    addToCart(product, quantity, {
      deliveryDate,
      deliverySlot,
      giftMessage
    });
    if (openDrawer) {
      openCartDrawer();
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, {
      deliveryDate,
      deliverySlot,
      giftMessage
    });
    router.push('/checkout');
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-8 sm:py-12 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8 space-y-12">
        
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center gap-2 text-xs text-main-muted">
          <Link href="/" className="hover:text-primary">হোম</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">সব ফুল</Link>
          <span>/</span>
          <span className="text-main-text font-semibold">{product.name}</span>
        </div>

        {/* Main Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-soft border border-border-muted shadow-soft">
              <img
                src={product.images ? product.images[activeImageIndex] : product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-soft transition-colors ${
                  isFavorite
                    ? 'bg-primary text-white'
                    : 'bg-white/90 text-main-muted hover:text-primary'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
              </button>

              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full font-sans shadow-soft-sm">
                  -{toBengaliNumber(product.discountPercent)}% ছাড়
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-primary shadow-soft'
                        : 'border-border-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>
                <RatingStars rating={product.rating} count={product.reviewsCount} size={16} />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-main-text leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-main-subtle font-sans mt-0.5">{product.englishName}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-bold text-primary">
                  {formatBengaliPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-main-subtle line-through">
                    {formatBengaliPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-accent-green bg-accent-green-light px-2.5 py-0.5 rounded">
                    {toBengaliNumber(product.discountPercent)}% সাশ্রয়
                  </span>
                )}
              </div>

              <p className="text-sm text-main-muted mt-4 leading-relaxed">
                {product.description || product.shortDescription}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-surface-soft p-4 rounded-2xl border border-border-subtle">
              <div>
                <span className="text-main-subtle">ফুলের উপাদান:</span>
                <p className="font-semibold text-main-text mt-0.5">{product.stemCount}</p>
              </div>
              <div>
                <span className="text-main-subtle">স্থায়িত্ব:</span>
                <p className="font-semibold text-main-text mt-0.5">{product.lifespan}</p>
              </div>
              <div>
                <span className="text-main-subtle">সুগন্ধ:</span>
                <p className="font-semibold text-main-text mt-0.5">{product.fragrance}</p>
              </div>
              <div>
                <span className="text-main-subtle">র‍্যাপিং:</span>
                <p className="font-semibold text-main-text mt-0.5">{product.wrapping}</p>
              </div>
            </div>

            {/* Actions: Quantity & Delivery Date */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-main-text mb-1.5">
                    পরিমাণ:
                  </label>
                  <div className="flex items-center border border-border-muted rounded-xl bg-surface-white w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2 text-main-muted hover:text-primary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-bold text-main-text font-sans">
                      {toBengaliNumber(quantity)}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2 text-main-muted hover:text-primary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-xs font-semibold text-main-text mb-1.5 flex items-center gap-1">
                    <Calendar size={13} className="text-primary" />
                    <span>ডেলিভারির তারিখ:</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-surface-white border border-border-muted rounded-xl px-3 py-2 text-xs font-sans text-main-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Greeting message */}
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1.5 flex items-center gap-1">
                  <MessageSquare size={13} className="text-primary" />
                  <span>উপহার কার্ডে বার্তা (ফ্রি):</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="আপনার প্রিয়জনের জন্য কোনো বিশেষ বার্তা লিখুন..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-surface-white border border-border-muted rounded-xl p-3 text-xs text-main-text focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(true)}
                  className="btn-secondary-outline py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>কার্টে যোগ করুন</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary-burgundy py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-soft"
                >
                  <span>এখনই কিনুন →</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-soft border border-border-subtle flex items-center justify-around text-xs text-main-muted">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  <span>১০০% সতেজ ফুল</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-primary" />
                  <span>৩ ঘণ্টায় এক্সপ্রেস</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-accent-green" />
                  <span>নিরাপদ পেমেন্ট</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Bouquets */}
        <div className="pt-12 border-t border-border-subtle space-y-6">
          <h2 className="text-2xl font-bold text-main-text">আরও কিছু সুন্দর তোড়া</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onQuickView={(p) => setSelectedQuickView(p)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedQuickView && (
        <ProductDetailModal
          product={selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
        />
      )}
    </div>
  );
}
