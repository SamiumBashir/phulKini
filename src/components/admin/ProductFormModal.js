'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Flower2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import CloudinaryUploader from './CloudinaryUploader';

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSaveSuccess }) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    englishName: '',
    category: 'bouquets',
    categoryName: 'ফুলের তোড়া',
    price: '',
    originalPrice: '',
    stock: 50,
    shortDescription: '',
    description: '',
    stemCount: '১২টি তাজা ফুল ও ফিলার',
    lifespan: '৫-৭ দিন',
    fragrance: 'মিষ্টি প্রাকৃতিক সুবাস',
    wrapping: 'সিগনেচার বার্গান্ডি ম্যাট র‍্যাপিং',
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    isAvailable: true,
    images: []
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        englishName: productToEdit.englishName || '',
        category: productToEdit.category || 'bouquets',
        categoryName: productToEdit.categoryName || 'ফুলের তোড়া',
        price: productToEdit.price || '',
        originalPrice: productToEdit.originalPrice || '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 50,
        shortDescription: productToEdit.shortDescription || '',
        description: productToEdit.description || '',
        stemCount: productToEdit.stemCount || '১২টি তাজা ফুল ও ফিলার',
        lifespan: productToEdit.lifespan || '৫-৭ দিন',
        fragrance: productToEdit.fragrance || 'মিষ্টি প্রাকৃতিক সুবাস',
        wrapping: productToEdit.wrapping || 'সিগনেচার বার্গান্ডি ম্যাট র‍্যাপিং',
        isFeatured: !!productToEdit.isFeatured,
        isBestseller: !!productToEdit.isBestseller,
        isNew: !!productToEdit.isNew,
        isAvailable: productToEdit.isAvailable !== false,
        images: productToEdit.images || (productToEdit.image ? [productToEdit.image] : [])
      });
    } else {
      setFormData({
        name: '',
        englishName: '',
        category: 'bouquets',
        categoryName: 'ফুলের তোড়া',
        price: '',
        originalPrice: '',
        stock: 50,
        shortDescription: '',
        description: '',
        stemCount: '১২টি তাজা ফুল ও ফিলার',
        lifespan: '৫-৭ দিন',
        fragrance: 'মিষ্টি প্রাকৃতিক সুবাস',
        wrapping: 'সিগনেচার বার্গান্ডি ম্যাট র‍্যাপিং',
        isFeatured: false,
        isBestseller: false,
        isNew: true,
        isAvailable: true,
        images: []
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('পণ্যের বাংলা নাম আবশ্যক');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('সঠিক বিক্রয়মূল্য লিখুন');
      return;
    }
    if (formData.images.length === 0) {
      setError('কমপক্ষে ১টি ছবি আপলোড করুন');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        englishName: formData.englishName.trim(),
        category: formData.category,
        categoryName: formData.category === 'roses' ? 'গোলাপ' : formData.category === 'tulips' ? 'টিউলিপ' : formData.category === 'lilies' ? 'লিলি' : 'ফুলের তোড়া',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        shortDescription: formData.shortDescription,
        description: formData.description,
        stemCount: formData.stemCount,
        lifespan: formData.lifespan,
        fragrance: formData.fragrance,
        wrapping: formData.wrapping,
        isFeatured: formData.isFeatured,
        isBestseller: formData.isBestseller,
        isNew: formData.isNew,
        isAvailable: formData.isAvailable,
        images: formData.images
      };

      const url = productToEdit?.id
        ? `/api/products/${productToEdit.id}`
        : '/api/products';
      const method = productToEdit?.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        addToast(
          productToEdit ? 'পণ্য সফলভাবে আপডেট হয়েছে! 🌸' : 'নতুন ফুল শপে যুক্ত হয়েছে! 🌸',
          'success'
        );
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } else {
        setError(data.message || 'পণ্য সংরক্ষণ করা যায়নি');
      }
    } catch (err) {
      setError('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-bengali">
      <div className="bg-white border border-[#E8DDD9] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-[#420000] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Flower2 size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {productToEdit ? 'পণ্য সম্পাদনা করুন' : 'নতুন ফুল / তোড়া যুক্ত করুন'}
              </h2>
              <p className="text-xs text-white/80">CMS প্রোডাক্ট ম্যানেজমেন্ট</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cloudinary Image Uploader */}
          <CloudinaryUploader
            initialImages={formData.images}
            onImagesUploaded={(imgs) => setFormData({ ...formData, images: imgs })}
          />

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-main-text mb-1">
                পণ্যের বাংলা নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: রক্ত গোলাপ তোড়া"
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-main-text mb-1">
                ইংরেজি নাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={formData.englishName}
                onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                placeholder="Red Rose Luxury Bouquet"
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-main-text mb-1">
                ক্যাটাগরি
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="bouquets">ফুলের তোড়া (Bouquets)</option>
                <option value="roses">গোলাপ (Roses)</option>
                <option value="tulips">টিউলিপ (Tulips)</option>
                <option value="lilies">লিলি (Lilies)</option>
                <option value="sunflowers">সূর্যমুখী (Sunflowers)</option>
                <option value="gifts">গিফট ও হ্যাম্পার</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-main-text mb-1">
                স্টক পরিমাণ
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-main-text mb-1">
                বিক্রয়মূল্য (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500"
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-main-text mb-1">
                পূর্বের মূল্য (ছাড় দেখাতে)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="2800"
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text font-sans focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-main-text mb-1">
                সংক্ষিপ্ত বিবরণ
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="সদ্য ফোটা প্রিমিয়াম রক্ত গোলাপের ক্লাসিক তোড়া"
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-main-text mb-1">
                বিস্তারিত বিবরণ
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="এই তোড়াটি প্রতিটি বিশেষ মুহূর্তকে আরও স্মরণীয় করে তোলে..."
                className="w-full p-3 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* Badges & Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-[#FCF9F8] border border-[#D9C8C4] text-xs font-semibold text-main-text">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              <span>ফিচার্ড ফুল (হোমপেজে দেখাও)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              <span>বেস্টসেলার ব্যাজ</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              <span>বিক্রয়ের জন্য উন্মুক্ত (Active)</span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DDD9]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D9C8C4] text-xs font-semibold text-main-muted hover:bg-[#FCF9F8] transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-burgundy px-7 py-2.5 text-xs font-bold shadow-soft flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>সংরক্ষণ হচ্ছে...</span>
              ) : (
                <>
                  <Save size={15} />
                  <span>{productToEdit ? 'আপডেট করুন' : 'পণ্য প্রকাশ করুন'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
