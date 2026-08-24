import React from 'react';
import CartView from '@/components/cart/CartView';

export const metadata = {
  title: 'আপনার শপিং কার্ট | ফুল কিনি',
  description: 'ফুল কিনির কার্ট দেখুন এবং সহজে অর্ডার সম্পন্ন করুন।'
};

export default function CartPage() {
  return <CartView />;
}
