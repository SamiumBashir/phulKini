'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductContext';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  Phone,
  Clock,
  ChevronRight,
  Flower2
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { products } = useProducts();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search when pathname changes
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const filteredSearchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navLinks = [
    { name: 'হোম', href: '/' },
    { name: 'সব ফুল', href: '/shop' },
    { name: 'ফুলের তোড়া', href: '/shop?category=bouquets' },
    { name: 'তোড়া বানান ✨', href: '/custom-bouquet', highlight: true },
    { name: 'গিফট কম্বো', href: '/shop?category=gifts' },
    { name: 'আমাদের সম্পর্কে', href: '/about' },
    { name: 'যোগাযোগ', href: '/contact' }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white text-xs py-1.5 px-4 font-bengali tracking-wide hidden sm:block">
        <div className="max-w-container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[13px]">
            <span className="flex items-center gap-1.5 opacity-90">
              <Sparkles size={13} className="text-amber-300" />
              ঢাকার ভেতরে ৩ ঘণ্টায় এক্সপ্রেস ডেলিভারি সুবিধা
            </span>
            <span className="opacity-40">|</span>
            <span className="opacity-90">
              কুপন কোড: <strong className="text-amber-300 font-mono tracking-wider font-sans">PHUL10</strong> ব্যবহারে ১০% ছাড়!
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <a href="tel:+8801700000000" className="flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity">
              <Phone size={12} />
              ০১৭০০-০০০০০০
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-soft border-b border-border-muted/70 py-3'
            : 'bg-surface-bg border-b border-border-muted py-4'
        }`}
      >
        <div className="max-w-container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-main-text hover:text-primary transition-colors lg:hidden rounded-lg hover:bg-surface-soft"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105 duration-300">
                <Flower2 size={22} className="text-primary-light animate-pulse-subtle" />
              </div>
              <div className="flex flex-col">
                <span className="font-bengali font-bold text-2xl md:text-3xl text-primary tracking-tight leading-none">
                  ফুল কিনি
                </span>
                <span className="text-[10px] md:text-[11px] text-main-muted font-bengali tracking-wider mt-0.5 opacity-80 hidden sm:block">
                  ভালোবাসা হোক ফুলের ভাষায়
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-[14px] font-medium font-bengali rounded-full transition-all duration-200 ${
                    link.highlight
                      ? 'bg-primary-light text-primary hover:bg-primary hover:text-white font-semibold shadow-soft-sm'
                      : isActive
                      ? 'text-primary font-semibold bg-surface-soft'
                      : 'text-main-text hover:text-primary hover:bg-surface-soft/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search Pill & Action Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Pill Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-surface-white hover:bg-surface-soft border border-border-muted hover:border-primary/50 text-main-muted px-3.5 py-1.5 rounded-full text-sm font-bengali shadow-soft-sm transition-all duration-200 group"
              aria-label="Search"
            >
              <Search size={16} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-xs text-main-subtle">খুঁজুন...</span>
              <kbd className="hidden md:inline-block text-[10px] bg-surface-soft px-1.5 py-0.5 rounded text-main-muted border border-border-subtle">
                /
              </kbd>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-main-text hover:text-primary rounded-full hover:bg-surface-soft transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'fill-primary text-primary' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm font-sans animate-scale-in">
                  {toBengaliNumber(wishlistCount)}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-main-text hover:text-primary rounded-full hover:bg-surface-soft transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm font-sans animate-scale-in">
                  {toBengaliNumber(totalItemsCount)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div
            className="bg-surface-white border border-border-muted rounded-2xl max-w-xl w-full p-5 shadow-soft-xl animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2.5 flex-1">
                <Search size={20} className="text-primary shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ফুল, তোড়া বা উপহারের নাম লিখুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-main-text font-bengali text-base outline-none placeholder:text-main-subtle"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-main-muted hover:text-primary rounded-lg hover:bg-surface-soft"
              >
                <X size={20} />
              </button>
            </div>

            {/* Suggestions or Results */}
            <div className="mt-4 max-h-80 overflow-y-auto font-bengali">
              {searchQuery.trim() === '' ? (
                <div>
                  <p className="text-xs text-main-muted font-medium mb-2.5 uppercase tracking-wider">
                    জনপ্রিয় অনুসন্ধানসমূহ:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['মিডনাইট রোমান্স', 'গোলাপ', 'লিলি', 'টিউলিপ', 'পিওনি বক্স', 'গিফট হ্যাম্পার'].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => setSearchQuery(item)}
                          className="text-xs bg-surface-soft hover:bg-primary-light hover:text-primary text-main-text px-3 py-1.5 rounded-full transition-colors"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : filteredSearchResults.length > 0 ? (
                <div className="divide-y divide-border-subtle">
                  {filteredSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        router.push(`/shop?product=${prod.slug}`);
                        setSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 hover:bg-surface-soft rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images && prod.images[0] ? prod.images[0] : prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-border-subtle"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-main-text">{prod.name}</h4>
                          <p className="text-xs text-main-muted">{prod.categoryName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">
                          {formatBengaliPrice(prod.price)}
                        </span>
                        <ChevronRight size={16} className="text-main-muted ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-main-muted">
                  <p className="text-sm">“{searchQuery}” দিয়ে কোনো ফুল খুঁজে পাওয়া যায়নি।</p>
                  <p className="text-xs mt-1 text-main-subtle">অন্য নাম লিখে চেষ্টা করুন অথবা আমাদের সব ফুল ব্রাউজ করুন।</p>
                </div>
              )}
            </div>

            {searchQuery.trim() && filteredSearchResults.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border-subtle text-center">
                <Link
                  href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchOpen(false)}
                  className="text-xs font-semibold text-primary hover:underline font-bengali"
                >
                  সব ফলাফল দেখুন ({toBengaliNumber(filteredSearchResults.length)}টি) →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex">
          <div className="w-[82%] max-w-sm bg-surface-white h-full p-6 shadow-soft-xl flex flex-col justify-between overflow-y-auto animate-slide-up font-bengali">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <Flower2 size={18} />
                  </div>
                  <span className="font-bold text-xl text-primary">ফুল কিনি</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-main-muted hover:text-primary rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs text-main-muted my-3 italic">
                “ভালোবাসা হোক ফুলের ভাষায়”
              </p>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base transition-colors ${
                        link.highlight
                          ? 'bg-primary-light text-primary font-semibold'
                          : isActive
                          ? 'bg-surface-soft text-primary font-bold'
                          : 'text-main-text hover:bg-surface-soft'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="opacity-60" />
                    </Link>
                  );
                })}
              </div>

              {/* Quick Info Box */}
              <div className="mt-8 p-3.5 rounded-xl bg-surface-soft border border-border-subtle text-xs space-y-2 text-main-muted">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>প্রতিদিন সকাল ৮:০০ - রাত ১১:০০</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span>হেল্পলাইন: ০১৭০০-০০০০০০</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 border-t border-border-subtle">
              <Link
                href="/custom-bouquet"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-primary-burgundy text-xs py-2.5 justify-center flex"
              >
                তোড়া কাস্টমাইজ করুন →
              </Link>
            </div>
          </div>
          
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
