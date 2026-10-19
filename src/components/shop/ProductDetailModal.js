'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatBengaliPrice, toBengaliNumber, formatBengaliDate, DELIVERY_SLOTS } from '@/utils/bengaliUtils';
import RatingStars from '@/components/common/RatingStars';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  const router = useRouter();
  const { addToCart, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [giftMessage, setGiftMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (openDrawer = false) => {
    addToCart(product, quantity, {
      deliveryDate,
      deliverySlot,
      giftMessage,
      senderName
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    if (openDrawer) {
      onClose();
      openCartDrawer();
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, {
      deliveryDate,
      deliverySlot,
      giftMessage,
      senderName
    });
    onClose();
    router.push('/checkout');
  };

  const messagePresets = [
    'জন্মদিনের অনেক অনেক শুভকামনা ও ভালোবাসা! 🎂',
    'আমার হৃদয়ের সবটুকু ভালোবাসা তোমার জন্য ❤️',
    'শুভ বিবাহবার্ষিকী! আগামী দিনগুলো আনন্দে কাটুক 💍',
    'তোমার এই সাফল্যে আমি অত্যন্ত গর্বিত! অভিনন্দন 🌟'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in font-bengali">
      <div
        className="relative bg-surface-white border border-border-muted rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-soft-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-surface-soft/90 hover:bg-surface-soft border border-border-muted flex items-center justify-center text-main-muted hover:text-primary transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-3">
            {/* Main Active Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-soft border border-border-muted">
              <img
                src={product.images ? product.images[activeImageIndex] : product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.discountPercent > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-soft-sm font-sans">
                    -{toBengaliNumber(product.discountPercent)}% ছাড়
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-soft-sm">
                    বেস্টসেলার ✨
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-soft transition-colors ${
                  isFavorite
                    ? 'bg-primary text-white'
                    : 'bg-white/90 text-main-muted hover:text-primary'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} className={isFavorite ? 'fill-white' : ''} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2.5">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-primary shadow-soft-sm scale-95'
                        : 'border-border-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Under Image */}
            <div className="mt-3 p-3.5 rounded-2xl bg-surface-soft border border-border-subtle text-xs space-y-2 text-main-muted">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary shrink-0" />
                <span><strong>তাজা ফুলের গ্যারান্টি:</strong> সরাসরি ফার্ম থেকে সংগৃহীত</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-primary shrink-0" />
                <span><strong>এক্সপ্রেস ডেলিভারি:</strong> ঢাকায় ৩ ঘণ্টার মধ্যে ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} className="text-primary shrink-0" />
                <span><strong>রিপ্লেসমেন্ট পলিসি:</strong> ফুল অসন্তোষজনক হলে তাৎক্ষণিক পরিবর্তন</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Order Configuration (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                  {product.categoryName}
                </span>
                <RatingStars rating={product.rating} count={product.reviewsCount} size={15} />
              </div>

              {/* Title & English Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-bold text-main-text mt-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-main-subtle font-sans tracking-wide mt-0.5">
                {product.englishName}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {formatBengaliPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-main-subtle line-through opacity-70">
                    {formatBengaliPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-accent-green bg-accent-green-light px-2 py-0.5 rounded">
                    {toBengaliNumber(product.discountPercent)}% সাশ্রয়
                  </span>
                )}
              </div>

              {/* Full Description */}
              <p className="text-xs sm:text-sm text-main-muted mt-3 leading-relaxed">
                {product.description || product.shortDescription}
              </p>

              {/* Flower Composition Specs */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-surface-soft p-3 rounded-xl border border-border-subtle">
                <div>
                  <span className="text-main-subtle">ফুলের সংমিশ্রণ:</span>
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
                  <span className="text-main-subtle">প্যাকেজিং:</span>
                  <p className="font-semibold text-main-text mt-0.5">{product.wrapping}</p>
                </div>
              </div>
            </div>

            {/* Order Options */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              
              {/* Quantity and Delivery Date Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-main-text mb-1.5">
                    পরিমাণ (তোড়া):
                  </label>
                  <div className="flex items-center border border-border-muted rounded-xl bg-surface-white w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-main-muted hover:text-primary hover:bg-surface-soft rounded-l-xl transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-bold text-main-text font-sans">
                      {toBengaliNumber(quantity)}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-main-muted hover:text-primary hover:bg-surface-soft rounded-r-xl transition-colors"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-xs font-semibold text-main-text mb-1.5 flex items-center gap-1">
                    <Calendar size={13} className="text-primary" />
                    <span>ডেলিভারি তারিখ:</span>
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-surface-white border border-border-muted rounded-xl px-3 py-2 text-xs text-main-text focus:outline-none focus:border-primary font-sans"
                  />
                </div>
              </div>

              {/* Delivery Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1.5 flex items-center gap-1">
                  <Clock size={13} className="text-primary" />
                  <span>ডেলিভারি সময় স্লট:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DELIVERY_SLOTS.slice(0, 3).map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        deliverySlot === slot.id
                          ? 'border-primary bg-primary-light/40 text-primary font-semibold'
                          : 'border-border-subtle hover:border-border-muted text-main-muted bg-surface-white'
                      }`}
                    >
                      <span className="block font-medium text-[11px]">{slot.tag}</span>
                      <span className="block text-[10px] text-main-subtle mt-0.5">{slot.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Personalized Greeting Card Message */}
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1.5 flex items-center gap-1">
                  <MessageSquare size={13} className="text-primary" />
                  <span>ফ্রি উপহার কার্ড বার্তা (ঐচ্ছিক):</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="আপনার প্রিয়জনের জন্য শুভেচ্ছা বা বার্তা লিখুন..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-surface-white border border-border-muted rounded-xl p-2.5 text-xs text-main-text placeholder:text-main-subtle focus:outline-none focus:border-primary resize-none"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {messagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGiftMessage(preset)}
                      className="text-[10px] bg-surface-soft hover:bg-primary-light hover:text-primary text-main-muted px-2 py-0.5 rounded-full border border-border-subtle transition-colors truncate max-w-[200px]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(true)}
                  className="btn-secondary-outline py-3 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn-primary-burgundy py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-soft"
                >
                  <span>এখনই কিনুন →</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-main-muted opacity-85">
                <ShieldCheck size={14} className="text-accent-green" />
                <span>নিরাপদ 256-bit এনক্রিপশন পেমেন্ট ও ফার্ম-ফ্রেশ ফুলের নিশ্চয়তা</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
