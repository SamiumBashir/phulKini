import React, { Suspense } from 'react';
import OrderConfirmationView from '@/components/order/OrderConfirmationView';

export const metadata = {
  title: 'অর্ডার নিশ্চিতকরণ ও ট্র্যাকিং | ফুল কিনি',
  description: 'আপনার অর্ডারের রসিদ ও রিয়েল-টাইম ডেলিভারি ট্র্যাকিং স্ট্যাটাস।'
};

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 py-20 text-center font-bengali text-main-muted">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">অর্ডার ট্র্যাকিং লোড হচ্ছে...</p>
        </div>
      }
    >
      <OrderConfirmationView />
    </Suspense>
  );
}
