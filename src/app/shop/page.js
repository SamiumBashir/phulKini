import React, { Suspense } from 'react';
import ShopCatalogView from '@/components/shop/ShopCatalogView';

export const metadata = {
  title: 'সব ফুল ও তোড়া কালেকশন | ফুল কিনি',
  description: 'গোলাপ, লিলি, টিউলিপ, সূর্যমুখী ও প্রিমিয়াম ফ্লোরাল বক্সের বিশাল কালেকশন।'
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 py-20 text-center font-bengali text-main-muted">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">ফুলের কালেকশন লোড হচ্ছে...</p>
        </div>
      }
    >
      <ShopCatalogView />
    </Suspense>
  );
}
