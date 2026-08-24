import React from 'react';
import ProductDetailPageView from '@/components/shop/ProductDetailPageView';
import { PRODUCTS } from '@/data/products';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product =
    PRODUCTS.find((p) => p.slug === resolvedParams.id || p.id === resolvedParams.id) ||
    PRODUCTS[0];

  return {
    title: `${product.name} | ফুল কিনি`,
    description: product.shortDescription
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  return <ProductDetailPageView productId={resolvedParams.id} />;
}
