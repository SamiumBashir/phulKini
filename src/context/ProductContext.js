'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

const STORAGE_KEY = 'phul_kini_dynamic_products';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToast } = useToast();

  // Load products from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const saveProducts = (newList) => {
    setProducts(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  };

  // Add a new product via CMS
  const addProduct = (productData) => {
    const slug =
      productData.slug ||
      (productData.englishName || productData.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `flower-${Date.now()}`;

    const id = `pk-${Date.now()}`;

    const newProduct = {
      id,
      slug,
      name: productData.name,
      englishName: productData.englishName || productData.name,
      category: productData.category || 'bouquets',
      categoryName: productData.categoryName || 'ফুলের তোড়া',
      price: Number(productData.price) || 2500,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      discountPercent:
        productData.originalPrice && Number(productData.originalPrice) > Number(productData.price)
          ? Math.round(
              ((Number(productData.originalPrice) - Number(productData.price)) /
                Number(productData.originalPrice)) *
                100
            )
          : 0,
      rating: Number(productData.rating) || 5.0,
      reviewsCount: Number(productData.reviewsCount) || 1,
      isFeatured: !!productData.isFeatured,
      isBestseller: !!productData.isBestseller,
      isNew: productData.isNew !== undefined ? !!productData.isNew : true,
      inStock: productData.inStock !== undefined ? !!productData.inStock : true,
      images:
        productData.images && productData.images.length > 0
          ? productData.images
          : [
              'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000&auto=format&fit=crop'
            ],
      shortDescription:
        productData.shortDescription || 'তাজা ফুল দিয়ে সাজানো মনোরম ফ্লোরাল আয়োজন।',
      description:
        productData.description ||
        'ফুল কিনির প্রিমিয়াম কালেকশনের একটি অনন্য মাস্টারপিস। সরাসরি সংগ্রহকৃত তাজা ফুলের মনোমুগ্ধকর তোড়া।',
      stemCount: productData.stemCount || '১২টি তাজা ফুল ও ফিলার',
      fragrance: productData.fragrance || 'মিষ্টি প্রাকৃতিক সুবাস',
      lifespan: productData.lifespan || '৫-৭ দিন',
      wrapping: productData.wrapping || 'সিগনেচার বার্গান্ডি ম্যাট র‍্যাপিং',
      occasions: productData.occasions || ['birthday', 'love']
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);
    addToast(`“${newProduct.name}” সফলভাবে ক্যাটালগে যুক্ত হয়েছে! 🌸`, 'success');
    return newProduct;
  };

  // Update existing product
  const updateProduct = (id, updatedFields) => {
    const updated = products.map((item) => {
      if (item.id === id) {
        const price = updatedFields.price !== undefined ? Number(updatedFields.price) : item.price;
        const originalPrice =
          updatedFields.originalPrice !== undefined
            ? Number(updatedFields.originalPrice)
            : item.originalPrice;

        const discountPercent =
          originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

        return {
          ...item,
          ...updatedFields,
          price,
          originalPrice,
          discountPercent
        };
      }
      return item;
    });

    saveProducts(updated);
    addToast('পণ্যের তথ্য সফলভাবে আপডেট হয়েছে! ✓', 'success');
  };

  // Delete product
  const deleteProduct = (id) => {
    const target = products.find((p) => p.id === id);
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
    addToast(`“${target ? target.name : 'পণ্য'}” সফলভাবে ডিলিট করা হয়েছে`, 'info');
  };

  // Toggle inStock
  const toggleStock = (id) => {
    const updated = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    saveProducts(updated);
    const item = updated.find((p) => p.id === id);
    addToast(
      `স্টক স্ট্যাটাস: ${item.inStock ? 'ইন-স্টক (In Stock)' : 'আউট-অফ-স্টক (Out of Stock)'}`,
      'info'
    );
  };

  // Reset to initial demo catalog
  const resetToDefaults = () => {
    saveProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    addToast('ডিফল্ট ক্যাটালগ ডাটা সফলভাবে রিস্টোর করা হয়েছে 🌸', 'success');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        resetToDefaults
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
