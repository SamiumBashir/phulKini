'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toBengaliNumber } from '@/utils/bengaliUtils';
import { Home, Grid, Heart, ShoppingBag, Sparkles } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  const items = [
    { label: 'হোম', href: '/', icon: Home },
    { label: 'ক্যাটাগরি', href: '/shop', icon: Grid },
    { label: 'তোড়া বানান', href: '/custom-bouquet', icon: Sparkles, highlight: true },
    { label: 'উইশলিস্ট', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'কার্ট', action: openCartDrawer, icon: ShoppingBag, badge: totalItemsCount }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-white/95 backdrop-blur-md border-t border-border-muted px-2 py-1.5 md:hidden shadow-soft-lg font-bengali">
      <div className="flex items-center justify-around">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          const content = (
            <div
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                item.highlight
                  ? 'text-primary font-bold'
                  : isActive
                  ? 'text-primary font-semibold'
                  : 'text-main-muted hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`${
                    item.highlight
                      ? 'text-primary animate-pulse-subtle'
                      : isActive
                      ? 'text-primary'
                      : ''
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center font-sans shadow-sm">
                    {toBengaliNumber(item.badge)}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </div>
          );

          if (item.action) {
            return (
              <button key={idx} onClick={item.action} className="focus:outline-none">
                {content}
              </button>
            );
          }

          return (
            <Link key={idx} href={item.href || '/'}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
