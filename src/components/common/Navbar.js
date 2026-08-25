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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

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
      {/* Main Luxury Navbar Matching User Reference */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 bg-[#FCF9F8] border-b border-[#E3BEB8]/50 ${
          isScrolled ? 'shadow-soft-sm py-3' : 'py-3.5'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Title (Protected against unwanted browser auto-translation) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#1B1C1C] hover:text-[#610000] transition-colors lg:hidden rounded-lg hover:bg-[#F2E8E5]"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group notranslate" translate="no">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#610000] flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105 duration-200 shrink-0">
                <Flower2 size={22} className="text-[#FFDAD4]" />
              </div>
              <div className="flex flex-col notranslate" translate="no">
                <span className="notranslate font-bengali font-bold text-2xl md:text-[26px] text-[#610000] tracking-tight leading-none" translate="no">
                  ফুল কিনি
                </span>
                <span className="notranslate text-[11px] text-[#7A6B68] font-bengali tracking-normal mt-0.5 opacity-90 hidden sm:block" translate="no">
                  ভালোবাসা হোক ফুলের ভাষায়
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 font-bengali">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium transition-all duration-150 ${
                    link.highlight
                      ? 'bg-[#FFDAD4] text-[#610000] px-4 py-1.5 rounded-full font-semibold shadow-soft-sm hover:bg-[#FAD0C8]'
                      : isActive
                      ? 'text-[#610000] font-bold'
                      : 'text-[#1B1C1C] hover:text-[#610000]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search Pill & Action Icons */}
          <div className="flex items-center gap-3.5">
            {/* Search Pill Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-transparent hover:bg-white/80 border border-[#E3BEB8] text-[#610000] px-3.5 py-1.5 rounded-full text-sm font-bengali transition-all duration-150 group shadow-soft-sm"
              aria-label="Search"
            >
              <Search size={15} className="text-[#610000] group-hover:scale-110 transition-transform" />
              <span className="text-xs text-[#7A6B68] hidden sm:inline">খুঁজুন...</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-[#F5E6E3] px-1.5 py-0.5 rounded text-[#7A6B68] border border-[#E3BEB8]/60 font-sans">
                /
              </kbd>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1.5 text-[#1B1C1C] hover:text-[#610000] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={21} className={wishlistCount > 0 ? 'fill-[#610000] text-[#610000]' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#610000] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-sans">
                  {toBengaliNumber(wishlistCount)}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-1.5 text-[#1B1C1C] hover:text-[#610000] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#610000] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-sans">
                  {toBengaliNumber(totalItemsCount)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in font-bengali">
          <div
            className="bg-surface-white border border-[#E3BEB8] rounded-2xl max-w-xl w-full p-5 shadow-soft-xl animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2.5 flex-1">
                <Search size={18} className="text-[#610000] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ফুল, তোড়া বা উপহারের নাম লিখুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-main-text text-base outline-none placeholder:text-main-subtle"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-main-muted hover:text-[#610000] rounded-lg hover:bg-surface-soft"
              >
                <X size={20} />
              </button>
            </div>

            {/* Suggestions or Results */}
            <div className="mt-4 max-h-80 overflow-y-auto">
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
                          className="text-xs bg-surface-soft hover:bg-[#FFDAD4] hover:text-[#610000] text-main-text px-3 py-1.5 rounded-full transition-colors"
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
                        <span className="text-sm font-bold text-[#610000]">
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
                  className="text-xs font-semibold text-[#610000] hover:underline"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex font-bengali">
          <div className="w-[82%] max-w-sm bg-[#FCF9F8] h-full p-6 shadow-soft-xl flex flex-col justify-between overflow-y-auto animate-slide-up">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E3BEB8]/50 notranslate" translate="no">
                <div className="flex items-center gap-2 notranslate" translate="no">
                  <div className="w-8 h-8 rounded-full bg-[#610000] flex items-center justify-center text-white">
                    <Flower2 size={18} className="text-[#FFDAD4]" />
                  </div>
                  <span className="font-bold text-xl text-[#610000] notranslate" translate="no">ফুল কিনি</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-main-muted hover:text-[#610000] rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-xs text-[#7A6B68] my-3 italic notranslate" translate="no">
                “ভালোবাসা হোক ফুলের ভাষায়”
              </p>

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
                          ? 'bg-[#FFDAD4] text-[#610000] font-semibold'
                          : isActive
                          ? 'bg-[#F2E8E5] text-[#610000] font-bold'
                          : 'text-[#1B1C1C] hover:bg-[#F2E8E5]'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="opacity-60" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E3BEB8]/50">
              <Link
                href="/custom-bouquet"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#610000] text-white hover:bg-[#4E0000] py-2.5 rounded-full text-xs font-bold justify-center flex transition-colors shadow-soft"
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
