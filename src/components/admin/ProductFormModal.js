'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '@/data/categories';
import { OCCASIONS } from '@/data/occasions';
import CloudinaryUploader from './CloudinaryUploader';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import { X, Sparkles, Plus, Check, Flower2, Save } from 'lucide-react';

export default function ProductFormModal({ product, onClose, onSave }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    englishName: '',
    category: 'bouquets',
    price: '',
    originalPrice: '',
    rating: 5.0,
    reviewsCount: 12,
    inStock: true,
    isBestseller: false,
    isNew: true,
    shortDescription: '',
    description: '',
    stemCount: '',
    fragrance: 'তাজা ও মিষ্টি প্রাকৃতিক সুবাস',
    lifespan: '৫-৭ দিন',
    wrapping: 'সিগনেচার লাক্সারি ম্যাট বার্গান্ডি র‍্যাপিং',
    occasions: ['love', 'birthday'],
    images: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        englishName: product.englishName || '',
        category: product.category || 'bouquets',
        price: product.price ? String(product.price) : '',
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        rating: product.rating || 5.0,
        reviewsCount: product.reviewsCount || 12,
        inStock: product.inStock !== undefined ? product.inStock : true,
        isBestseller: !!product.isBestseller,
        isNew: !!product.isNew,
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        stemCount: product.stemCount || '',
        fragrance: product.fragrance || 'তাজা ও মিষ্টি প্রাকৃতিক সুবাস',
        lifespan: product.lifespan || '৫-৭ দিন',
        wrapping: product.wrapping || 'সিগনেচার লাক্সারি ম্যাট বার্গান্ডি র‍্যাপিং',
        occasions: product.occasions || ['love', 'birthday'],
        images: product.images || []
      });
    }
  }, [product]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'পণ্যের বাংলা নাম আবশ্যক';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'সঠিক মূল্য উল্লেখ করুন';
    if (formData.images.length === 0) errs.images = 'কমপক্ষে ১টি ছবি আপলোড করুন';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedCategoryObj = CATEGORIES.find((c) => c.slug === formData.category);

    const payload = {
      ...formData,
      categoryName: selectedCategoryObj ? selectedCategoryObj.name : 'ফুলের তোড়া',
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null
    };

    onSave(payload);
    onClose();
  };

  const toggleOccasion = (tag) => {
    setFormData((prev) => {
      const exists = prev.occasions.includes(tag);
      return {
        ...prev,
        occasions: exists
          ? prev.occasions.filter((t) => t !== tag)
          : [...prev.occasions, tag]
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in font-bengali">
      <div
        className="relative bg-surface-white border border-border-muted rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-soft-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-subtle bg-surface-bg flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
              <Flower2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-main-text">
                {isEditing ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন ফুল / পণ্য আপলোড (Add Product)'}
              </h2>
              <p className="text-xs text-main-muted">
                {isEditing ? 'পণ্যের তথ্য ও ছবি পরিবর্তন করুন' : 'Cloudinary ইমেজ সহ নতুন ফুলের তথ্য দিন'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-main-muted hover:text-primary rounded-xl hover:bg-surface-soft transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          
          {/* Section 1: Basic Product Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-main-text border-b border-border-subtle pb-2">
              ১. সাধারণ তথ্য (Basic Info)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-main-text mb-1">
                  বাংলা নাম <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মিডনাইট রোমান্স বুকে"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-3 bg-surface-soft border rounded-xl text-main-text focus:outline-none focus:border-primary ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-border-muted'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-semibold text-main-text mb-1">
                  ইংরেজি নাম (English Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Romance Bouquet"
                  value={formData.englishName}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-main-text mb-1">
                  ক্যাটাগরি <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} ({c.englishName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-main-text mb-1">
                  বিক্রয় মূল্য (৳) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 3500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full p-3 bg-surface-soft border rounded-xl text-main-text font-sans font-bold text-primary focus:outline-none focus:border-primary ${
                    errors.price ? 'border-red-500 bg-red-50' : 'border-border-muted'
                  }`}
                />
                {errors.price && <p className="text-[11px] text-red-600 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block font-semibold text-main-text mb-1">
                  আগের / নিয়মিত মূল্য (ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 4200"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Live Discount Calculator Preview */}
            {formData.originalPrice && Number(formData.originalPrice) > Number(formData.price) && (
              <div className="p-2.5 rounded-xl bg-accent-green-light border border-accent-green/30 text-xs text-accent-green font-semibold flex items-center justify-between">
                <span>
                  🎉 স্বয়ংক্রিয় ডিসকাউন্ট ব্যাজ:{' '}
                  <strong>
                    -{toBengaliNumber(Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100))}% ছাড়
                  </strong>
                </span>
                <span>সাশ্রয়: {formatBengaliPrice(formData.originalPrice - formData.price)}</span>
              </div>
            )}
          </div>

          {/* Section 2: Cloudinary Image Uploader */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-base text-main-text border-b border-border-subtle pb-2 flex items-center justify-between">
              <span>২. পণ্যের ছবি আপলোড (Cloudinary Upload)</span>
              <span className="text-xs text-primary font-normal">ক্লাউডিনারি ইন্টিগ্রেশন</span>
            </h3>

            <CloudinaryUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            />
            {errors.images && <p className="text-[11px] text-red-600">{errors.images}</p>}
          </div>

          {/* Section 3: Descriptions & Composition Details */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-base text-main-text border-b border-border-subtle pb-2">
              ৩. বিবরণ ও ফ্লোরাল স্পেসিফিকেশন
            </h3>

            <div>
              <label className="block font-semibold text-main-text mb-1">
                সংক্ষিপ্ত বিবরণ (Short Description)
              </label>
              <input
                type="text"
                placeholder="যেমন: গভীর লাল ডাচ গোলাপের এক রাজকীয় সমাহার।"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-main-text mb-1">
                পূর্ণাঙ্গ বিবরণ (Full Description)
              </label>
              <textarea
                rows={3}
                placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-main-text mb-1">
                  ফুলের উপাদান ও স্টেম সংখ্যা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ২৪টি ডাচ লাল গোলাপ ও জিপসি"
                  value={formData.stemCount}
                  onChange={(e) => setFormData({ ...formData, stemCount: e.target.value })}
                  className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-main-text mb-1">
                  স্থায়িত্ব (Lifespan)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ৫-৭ দিন সতেজ থাকে"
                  value={formData.lifespan}
                  onChange={(e) => setFormData({ ...formData, lifespan: e.target.value })}
                  className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-main-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Occasions & Badges */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-base text-main-text border-b border-border-subtle pb-2">
              ৪. ব্যাজ ও উপলক্ষ ট্যাগ
            </h3>

            {/* Badges Toggle */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer bg-surface-soft p-2.5 px-4 rounded-xl border border-border-muted">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="accent-primary"
                />
                <span>ইন-স্টক (In Stock)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-surface-soft p-2.5 px-4 rounded-xl border border-border-muted">
                <input
                  type="checkbox"
                  checked={formData.isBestseller}
                  onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                  className="accent-primary"
                />
                <span>বেস্টসেলার ব্যাজ (Bestseller ✨)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-surface-soft p-2.5 px-4 rounded-xl border border-border-muted">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="accent-primary"
                />
                <span>নতুন কালেকশন (New Arrival)</span>
              </label>
            </div>

            {/* Occasion Tags */}
            <div>
              <label className="block font-semibold text-main-text mb-2">
                উপলক্ষ (যেকোনো এক বা একাধিক নির্বাচন করুন):
              </label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occ) => {
                  const isSelected = formData.occasions.includes(occ.recommendedTag);
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => toggleOccasion(occ.recommendedTag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-soft-sm'
                          : 'bg-surface-soft text-main-muted border border-border-muted hover:border-primary'
                      }`}
                    >
                      <span>{occ.icon}</span>
                      <span>{occ.title}</span>
                      {isSelected && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-6 border-t border-border-subtle flex items-center justify-end gap-3 sticky bottom-0 bg-surface-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-border-muted text-xs sm:text-sm font-semibold text-main-muted hover:text-primary hover:bg-surface-soft transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary-burgundy text-xs sm:text-sm py-2.5 px-8 font-bold shadow-soft flex items-center gap-2"
            >
              <Save size={16} />
              <span>{isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'পণ্য আপলোড করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
