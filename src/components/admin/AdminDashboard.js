'use client';

import React, { useState, useEffect } from 'react';
import {
  Flower2,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Truck,
  Users
} from 'lucide-react';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import { useToast } from '@/context/ToastContext';
import ProductFormModal from './ProductFormModal';

export default function AdminDashboard({ user, onLogout }) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'analytics'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Modals
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/analytics').then(r => r.json()),
        fetch('/api/products?limit=100').then(r => r.json()),
        fetch('/api/orders?limit=100').then(r => r.json())
      ]);

      if (analyticsRes.success) setStats(analyticsRes.stats);
      if (productsRes.success) setProducts(productsRes.products);
      if (ordersRes.success) setOrders(ordersRes.orders);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      addToast('সফলভাবে লগআউট করা হয়েছে', 'info');
      if (onLogout) onLogout();
    } catch (e) {}
  };

  // Toggle Product Availability
  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !product.isAvailable })
      });
      const data = await res.json();
      if (data.success) {
        addToast(
          product.isAvailable ? 'পণ্য সাময়িকভাবে স্টক-আউট করা হয়েছে' : 'পণ্য স্টকে অন্তর্ভুক্ত করা হয়েছে',
          'info'
        );
        fetchDashboardData();
      }
    } catch (e) {}
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে “${name}” ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে', 'success');
        fetchDashboardData();
      }
    } catch (e) {}
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`অর্ডার স্ট্যাটাস আপডেট: ${newStatus}`, 'success');
        fetchDashboardData();
      }
    } catch (e) {}
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.englishName?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'ALL') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-[#FCF9F8] font-bengali pb-20">
      
      {/* Top Admin Header */}
      <header className="bg-[#1C1010] text-[#E8DDD9] border-b border-[#3B2828] sticky top-0 z-30">
        <div className="max-w-container mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
              <Flower2 size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">ফুল কিনি CMS</span>
                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-sans font-bold">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-[#A89692]">
                লগইন: {user?.name || 'অ্যাডমিন'} ({user?.role || 'SUPER_ADMIN'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#E8DDD9] hover:text-white px-3 py-1.5 rounded-lg bg-[#2A1717] border border-[#482D2D] flex items-center gap-1.5 transition-colors"
            >
              <span>শপ দেখুন</span>
              <ExternalLink size={13} />
            </a>

            <button
              onClick={handleLogout}
              className="text-xs text-red-300 hover:text-red-100 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-container mx-auto px-4 md:px-8 pt-8 space-y-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-luxury p-5 bg-white border border-[#E8DDD9] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-main-muted font-medium">মোট বিক্রয় রেভিনিউ</p>
              <h3 className="text-xl font-bold text-main-text mt-0.5">
                {formatBengaliPrice(stats.totalRevenue)}
              </h3>
            </div>
          </div>

          <div className="card-luxury p-5 bg-white border border-[#E8DDD9] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-main-muted font-medium">অপেক্ষমাণ অর্ডার</p>
              <h3 className="text-xl font-bold text-main-text mt-0.5">
                {toBengaliNumber(stats.pendingOrders)}টি
              </h3>
            </div>
          </div>

          <div className="card-luxury p-5 bg-white border border-[#E8DDD9] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs text-main-muted font-medium">মোট অর্ডার সম্পন্ন</p>
              <h3 className="text-xl font-bold text-main-text mt-0.5">
                {toBengaliNumber(stats.totalOrders)}টি
              </h3>
            </div>
          </div>

          <div className="card-luxury p-5 bg-white border border-[#E8DDD9] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Flower2 size={24} />
            </div>
            <div>
              <p className="text-xs text-main-muted font-medium">লাইভ ফুল ক্যাটালগ</p>
              <h3 className="text-xl font-bold text-main-text mt-0.5">
                {toBengaliNumber(stats.totalProducts || products.length)}টি
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E8DDD9] pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-primary text-white shadow-soft'
                : 'text-main-muted hover:text-main-text hover:bg-white'
            }`}
          >
            🌸 ফুল ও তোড়া পরিচালনা ({toBengaliNumber(products.length)})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-soft'
                : 'text-main-muted hover:text-main-text hover:bg-white'
            }`}
          >
            📦 কাস্টমার অর্ডার্স ({toBengaliNumber(orders.length)})
          </button>
        </div>

        {/* Products Management View */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="পণ্য বা ক্যাটাগরি খুঁজুন..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D9C8C4] rounded-xl text-xs text-main-text focus:outline-none focus:border-primary"
                />
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-main-muted" />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto btn-primary-burgundy px-5 py-2.5 text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>নতুন ফুল যোগ করুন</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="card-luxury bg-white border border-[#E8DDD9] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCF9F8] border-b border-[#E8DDD9] text-main-muted font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">ছবি ও নাম</th>
                      <th className="p-4">ক্যাটাগরি</th>
                      <th className="p-4">মূল্য</th>
                      <th className="p-4">স্টক</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E6E3]">
                    {filteredProducts.map((prod) => {
                      const img = prod.images && prod.images[0] ? prod.images[0] : prod.image;
                      return (
                        <tr key={prod.id} className="hover:bg-[#FCF9F8]/60 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={img}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#E8DDD9] shrink-0"
                              />
                              <div>
                                <span className="font-bold text-main-text block line-clamp-1">{prod.name}</span>
                                {prod.englishName && (
                                  <span className="text-[11px] text-main-muted font-sans block">{prod.englishName}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#FCF9F8] border border-[#E8DDD9] text-[11px] font-medium text-main-text">
                              {prod.categoryName || prod.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-primary text-sm">
                            {formatBengaliPrice(prod.price)}
                          </td>
                          <td className="p-4">
                            <span className="font-sans font-semibold text-main-text">
                              {toBengaliNumber(prod.stock || 50)}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                                prod.isAvailable
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {prod.isAvailable ? (
                                <>
                                  <CheckCircle2 size={12} />
                                  <span>ইন স্টক</span>
                                </>
                              ) : (
                                <>
                                  <XCircle size={12} />
                                  <span>স্টক-আউট</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="সম্পাদনা করুন"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management View */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['ALL', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    orderStatusFilter === st
                      ? 'bg-primary text-white'
                      : 'bg-white border border-[#D9C8C4] text-main-muted'
                  }`}
                >
                  {st === 'ALL' ? 'সব অর্ডার' : st}
                </button>
              ))}
            </div>

            <div className="card-luxury bg-white border border-[#E8DDD9] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCF9F8] border-b border-[#E8DDD9] text-main-muted font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">অর্ডার নম্বর</th>
                      <th className="p-4">গ্রাহক ও ফোন</th>
                      <th className="p-4">ডেলিভারি ঠিকানা ও স্লট</th>
                      <th className="p-4">মোট বিল</th>
                      <th className="p-4">পেমেন্ট</th>
                      <th className="p-4">বর্তমান স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E6E3]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FCF9F8]/60 transition-colors">
                        <td className="p-4 font-bold text-primary font-sans">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-main-text block">{ord.customer?.name}</span>
                          <span className="text-[11px] text-main-muted font-sans block">{ord.customer?.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-main-text block line-clamp-1">{ord.delivery?.address}</span>
                          <span className="text-[11px] text-main-muted block">
                            {ord.delivery?.area} • {ord.delivery?.date}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-main-text">
                          {formatBengaliPrice(ord.pricing?.total)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.payment?.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.payment?.method?.toUpperCase()} ({ord.payment?.status})
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="p-1.5 bg-[#FCF9F8] border border-[#D9C8C4] rounded-lg text-xs font-semibold text-main-text focus:outline-none focus:border-primary cursor-pointer"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onSaveSuccess={fetchDashboardData}
      />
    </div>
  );
}
