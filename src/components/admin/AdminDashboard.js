'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { CATEGORIES } from '@/data/categories';
import ProductFormModal from './ProductFormModal';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  LogOut,
  Flower2,
  Eye,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock, resetToDefaults } =
    useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.englishName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Category
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // Stock Filter
    if (stockFilter === 'in_stock' && !p.inStock) return false;
    if (stockFilter === 'out_of_stock' && p.inStock) return false;

    return true;
  });

  // Summary Metrics
  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalCount - inStockCount;
  const bestsellerCount = products.filter((p) => p.isBestseller).length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="py-8 sm:py-12 font-bengali min-h-screen bg-surface-bg">
      <div className="max-w-container mx-auto px-4 md:px-8 space-y-8">
        
        {/* Dashboard Top Header */}
        <div className="card-luxury p-6 sm:p-8 bg-surface-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Flower2 size={26} className="text-primary-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-main-text">
                  ফুল কিনি CMS কন্ট্রোল প্যানেল
                </h1>
                <span className="text-xs bg-primary-light text-primary font-bold px-2.5 py-0.5 rounded-full font-sans">
                  v1.0 Live
                </span>
              </div>
              <p className="text-xs text-main-muted mt-1">
                ওয়েবসাইটের পণ্যসমূহ আপলোড, সম্পাদনা, মূল্য নির্ধারণ ও স্টক পরিচালনা করুন।
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/shop"
              target="_blank"
              className="btn-secondary-outline text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>লাইভ শপ দেখুন</span>
            </Link>

            <button
              onClick={handleOpenAdd}
              className="btn-primary-burgundy text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2 font-bold shadow-soft"
            >
              <Plus size={16} />
              <span>নতুন ফুল যোগ করুন</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 text-main-muted hover:text-red-600 rounded-xl hover:bg-surface-soft border border-border-subtle transition-colors"
              title="লগআউট"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-luxury p-5 bg-surface-white space-y-1">
            <span className="text-xs text-main-muted font-medium">মোট পণ্য সংখ্যা</span>
            <div className="text-2xl sm:text-3xl font-bold text-primary font-sans">
              {toBengaliNumber(totalCount)}টি
            </div>
            <p className="text-[11px] text-main-subtle">ক্যাটালগে সক্রিয় পণ্য</p>
          </div>

          <div className="card-luxury p-5 bg-surface-white space-y-1">
            <span className="text-xs text-accent-green font-medium">ইন-স্টক (উপলব্ধ)</span>
            <div className="text-2xl sm:text-3xl font-bold text-accent-green font-sans">
              {toBengaliNumber(inStockCount)}টি
            </div>
            <p className="text-[11px] text-main-subtle">সরাসরি অর্ডারযোগ্য</p>
          </div>

          <div className="card-luxury p-5 bg-surface-white space-y-1">
            <span className="text-xs text-amber-700 font-medium">বেস্টসেলার কালেকশন</span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-sans">
              {toBengaliNumber(bestsellerCount)}টি
            </div>
            <p className="text-[11px] text-main-subtle">টপ ট্রেন্ডিং তোড়া</p>
          </div>

          <div className="card-luxury p-5 bg-surface-white space-y-1">
            <span className="text-xs text-red-600 font-medium">আউট-অফ-স্টক</span>
            <div className="text-2xl sm:text-3xl font-bold text-red-600 font-sans">
              {toBengaliNumber(outOfStockCount)}টি
            </div>
            <p className="text-[11px] text-main-subtle">স্টক শেষ হওয়া পণ্য</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card-luxury p-4 sm:p-5 bg-surface-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-subtle" />
            <input
              type="text"
              placeholder="পণ্যের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-soft border border-border-muted rounded-xl text-xs sm:text-sm text-main-text focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-surface-soft border border-border-muted rounded-xl px-3 py-2 text-xs text-main-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">সব ক্যাটাগরি</option>
              {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Stock Select */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-surface-soft border border-border-muted rounded-xl px-3 py-2 text-xs text-main-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">সব স্টক স্ট্যাটাস</option>
              <option value="in_stock">শুধুমাত্র ইন-স্টক</option>
              <option value="out_of_stock">আউট-অফ-স্টক</option>
            </select>

            {/* Reset to Defaults */}
            <button
              onClick={() => {
                if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত পণ্য ডিফল্ট ক্যাটালগে রিসেট করতে চান?')) {
                  resetToDefaults();
                }
              }}
              className="px-3 py-2 border border-border-muted rounded-xl text-xs text-main-muted hover:text-primary hover:bg-surface-soft flex items-center gap-1 shrink-0"
              title="ডিফল্ট ক্যাটালগ রিস্টোর করুন"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">রিসেট</span>
            </button>
          </div>
        </div>

        {/* Products Table Container */}
        <div className="card-luxury bg-surface-white overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-soft border-b border-border-subtle text-main-text font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-4 sm:px-6">পণ্য (Product)</th>
                  <th className="py-4 px-4">ক্যাটাগরি</th>
                  <th className="py-4 px-4">মূল্য</th>
                  <th className="py-4 px-4">স্টক স্ট্যাটাস</th>
                  <th className="py-4 px-4">হাইলাইটস</th>
                  <th className="py-4 px-4 sm:px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-main-muted">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-main-muted">
                      <p className="text-sm font-semibold">কোনো পণ্য পাওয়া যায়নি</p>
                      <p className="text-xs text-main-subtle mt-1">
                        নতুন পণ্য যোগ করতে উপরের "নতুন ফুল যোগ করুন" বাটনে ক্লিক করুন।
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-soft/60 transition-colors">
                      {/* Product details & thumbnail */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images && prod.images[0] ? prod.images[0] : prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-border-subtle shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-main-text">{prod.name}</h4>
                            <p className="text-[11px] text-main-subtle font-sans">{prod.englishName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 bg-surface-soft border border-border-muted rounded-full text-xs font-semibold text-main-text">
                          {prod.categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-primary text-sm">
                        {formatBengaliPrice(prod.price)}
                        {prod.originalPrice && (
                          <span className="text-[11px] text-main-subtle line-through block font-normal">
                            {formatBengaliPrice(prod.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock Switch */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleStock(prod.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            prod.inStock
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {prod.inStock ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          <span>{prod.inStock ? 'ইন-স্টক' : 'আউট-অফ-স্টক'}</span>
                        </button>
                      </td>

                      {/* Highlights / Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.isBestseller && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                              বেস্টসেলার
                            </span>
                          )}
                          {prod.isNew && (
                            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                              নতুন
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/shop?product=${prod.slug}`}
                            target="_blank"
                            className="p-1.5 text-main-muted hover:text-primary rounded-lg hover:bg-surface-soft transition-colors"
                            title="ভিউ দেখুন"
                          >
                            <Eye size={15} />
                          </Link>

                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 text-main-muted hover:text-primary rounded-lg hover:bg-surface-soft transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(prod.id)}
                            className="p-1.5 text-main-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="পণ্যটি মুছে ফেলুন"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal (Add / Edit) */}
        {isModalOpen && (
          <ProductFormModal
            product={editingProduct}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="card-luxury p-6 max-w-sm w-full bg-surface-white space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-main-text">
                পণ্যটি মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-main-muted">
                এই পণ্যটি মুছে ফেললে তা লাইভ ওয়েবসাইট ও শপ ক্যাটালগ থেকে তৎক্ষণাৎ অদৃশ্য হয়ে যাবে।
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-border-muted rounded-full text-xs font-semibold text-main-muted"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-sm"
                >
                  হ্যাঁ, ডিলিট করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
