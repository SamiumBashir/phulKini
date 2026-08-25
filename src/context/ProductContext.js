'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '@/data/products';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn('Using default product catalog:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductBySlug = (slug) => {
    return (
      products.find((p) => p.slug === slug || p.id === slug) ||
      DEFAULT_PRODUCTS.find((p) => p.slug === slug || p.id === slug)
    );
  };

  const getProductsByCategory = (catSlug) => {
    if (!catSlug || catSlug === 'all') return products;
    return products.filter((p) => p.category === catSlug);
  };

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestsellerProducts = products.filter((p) => p.isBestseller);

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts: featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8),
        bestsellerProducts: bestsellerProducts.length > 0 ? bestsellerProducts : products.slice(0, 4),
        isLoading,
        getProductBySlug,
        getProductsByCategory,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
