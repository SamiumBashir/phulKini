import React from 'react';
import CustomBouquetBuilder from '@/components/builder/CustomBouquetBuilder';

export const metadata = {
  title: 'নিজের মতো করে তোড়া বানান | ফুল কিনি',
  description: 'আপনার পছন্দের ফুল, প্রিয় রঙ ও বাজেট অনুযায়ী ধাপে ধাপে তৈরি করুন একটি নিখুঁত ও অনন্য তোড়া।'
};

export default function CustomBouquetPage() {
  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <CustomBouquetBuilder />
      </div>
    </div>
  );
}
