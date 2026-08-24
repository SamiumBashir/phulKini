'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { CATEGORIES } from '@/data/categories';
import { OCCASIONS } from '@/data/occasions';
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import {
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  Tag
} from 'lucide-react';

export default function ShopCatalogView() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const occasionParam = searchParams.get('occasion');
  const searchParam = searchParams.get('search');
  const productParam = searchParams.get('product');

  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState(occasionParam || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceMax, setPriceMax] = useState(7500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync params if URL changes
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (occasionParam) setSelectedOccasion(occasionParam);
    if (searchParam) setSearchQuery(searchParam);
    if (productParam) {
      const match = products.find((p) => p.slug === productParam || p.id === productParam);
      if (match) setSelectedProduct(match);
    }
  }, [categoryParam, occasionParam, searchParam, productParam, products]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.englishName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Occasion
    if (selectedOccasion && selectedOccasion !== 'all') {
      list = list.filter((p) => p.occasions && p.occasions.includes(selectedOccasion));
    }

    // Max Price
    list = list.filter((p) => p.price <= priceMax);

    // In Stock
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'new') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // Default: popular / bestsellers first
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedOccasion, priceMax, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setPriceMax(7500);
    setInStockOnly(false);
    setSortBy('popular');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedOccasion !== 'all' ||
    priceMax < 7500 ||
    inStockOnly;

  return (
    <div className="py-8 sm:py-12 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Page Title & Breadcrumb Header */}
        <div className="mb-8 border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">
              ফুল কিনি ক্যাটালগ
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-main-text mt-1">
              {selectedCategory !== 'all'
                ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'ফুলের কালেকশন'
                : 'সব ফুল'}
            </h1>
            <p className="text-xs sm:text-sm text-main-muted mt-1">
              মোট {toBengaliNumber(filteredProducts.length)}টি তাজা ফুলের আয়োজন পাওয়া গেছে
            </p>
          </div>

          {/* Search bar in Shop Header */}
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-subtle" />
            <input
              type="text"
              placeholder="ফুল বা তোড়ার নাম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-surface-white border border-border-muted rounded-full text-xs sm:text-sm text-main-text placeholder:text-main-subtle focus:outline-none focus:border-primary shadow-soft-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-main-subtle hover:text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Top Filter Chips Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full sm:max-w-3xl">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-soft-sm'
                      : 'bg-surface-white hover:bg-surface-soft text-main-muted border border-border-muted'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-surface-white border border-border-muted rounded-xl text-xs font-semibold text-main-text flex items-center gap-1.5 shadow-soft-sm"
            >
              <SlidersHorizontal size={14} className="text-primary" />
              <span>ফিল্টার</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-surface-white border border-border-muted rounded-xl px-3 py-1.5 text-xs text-main-text shadow-soft-sm">
              <ArrowUpDown size={13} className="text-primary shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-main-text font-semibold outline-none cursor-pointer"
              >
                <option value="popular">জনপ্রিয়তা অনুযায়ী</option>
                <option value="price-low">দাম: কম থেকে বেশি</option>
                <option value="price-high">দাম: বেশি থেকে কম</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
                <option value="new">নতুন কালেকশন</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 bg-surface-white border border-border-muted rounded-3xl p-6 shadow-soft space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-bold text-base text-main-text flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <span>ফিল্টার অপশন</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-semibold text-main-text">সর্বোচ্চ মূল্য:</span>
                <span className="font-bold text-primary">{formatBengaliPrice(priceMax)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="7500"
                step="100"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-main-subtle mt-1 font-sans">
                <span>৳ ১,০০০</span>
                <span>৳ ৭,৫০০</span>
              </div>
            </div>

            {/* Occasion Filter */}
            <div>
              <h4 className="font-semibold text-xs text-main-text mb-2.5">
                উপলক্ষ (Occasion):
              </h4>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs text-main-muted hover:text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="occasion"
                    checked={selectedOccasion === 'all'}
                    onChange={() => setSelectedOccasion('all')}
                    className="accent-primary"
                  />
                  <span>সব উপলক্ষ</span>
                </label>
                {OCCASIONS.map((occ) => (
                  <label
                    key={occ.id}
                    className="flex items-center gap-2 text-xs text-main-muted hover:text-primary cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="occasion"
                      checked={selectedOccasion === occ.recommendedTag}
                      onChange={() => setSelectedOccasion(occ.recommendedTag)}
                      className="accent-primary"
                    />
                    <span>{occ.icon} {occ.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-3 border-t border-border-subtle">
              <label className="flex items-center gap-2 text-xs font-semibold text-main-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-primary rounded"
                />
                <span>শুধু ইন-স্টক ফুল দেখান</span>
              </label>
            </div>
          </div>

          {/* Products Grid (9 cols on desktop) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="card-luxury p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-soft mx-auto flex items-center justify-center text-3xl">
                  🌸
                </div>
                <h3 className="text-lg font-bold text-main-text">
                  কোনো ফুল খুঁজে পাওয়া যায়নি
                </h3>
                <p className="text-xs text-main-muted max-w-sm mx-auto">
                  আপনার নির্বাচিত ফিল্টার বা অনুসন্ধানের সাথে মিল রেখে কোনো আইটেম পাওয়া যায়নি। ফিল্টার পরিবর্তন করুন।
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary-burgundy text-xs py-2.5 px-6"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-[85%] max-w-xs bg-surface-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-slide-up">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="font-bold text-base text-main-text">ফিল্টারসমূহ</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-main-muted hover:text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Price Max */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-main-text">সর্বোচ্চ মূল্য:</span>
                  <span className="font-bold text-primary">{formatBengaliPrice(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="7500"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Occasions */}
              <div>
                <h4 className="font-semibold text-xs text-main-text mb-2">উপলক্ষ:</h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="radio"
                      name="m_occasion"
                      checked={selectedOccasion === 'all'}
                      onChange={() => setSelectedOccasion('all')}
                      className="accent-primary"
                    />
                    <span>সব উপলক্ষ</span>
                  </label>
                  {OCCASIONS.map((occ) => (
                    <label key={occ.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="m_occasion"
                        checked={selectedOccasion === occ.recommendedTag}
                        onChange={() => setSelectedOccasion(occ.recommendedTag)}
                        className="accent-primary"
                      />
                      <span>{occ.icon} {occ.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border-subtle space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full btn-primary-burgundy text-xs py-2.5"
              >
                ফিল্টার প্রয়োগ করুন
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full btn-secondary-outline text-xs py-2"
                >
                  সব রিসেট
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View / Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
