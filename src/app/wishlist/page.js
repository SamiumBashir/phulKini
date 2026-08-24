import React from 'react';
import WishlistView from '@/components/wishlist/WishlistView';

export const metadata = {
  title: 'পছন্দের তালিকা | ফুল কিনি',
  description: 'আপনার সংরক্ষিত পছন্দের ফুল ও তোড়ার তালিকা।'
};

export default function WishlistPage() {
  return <WishlistView />;
}
