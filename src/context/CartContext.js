'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'phul_kini_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { addToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isHydrated]);

  // Add Item to Cart
  const addItem = (product, quantity = 1, options = {}) => {
    setItems((prevItems) => {
      const cartId = options.customId || `${product.id || product.slug}`;
      const existingIndex = prevItems.findIndex((item) => item.cartId === cartId);

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity
        };
        return newItems;
      } else {
        const newItem = {
          cartId,
          id: product.id || product._id,
          productId: product.id || product._id,
          slug: product.slug,
          name: product.name,
          englishName: product.englishName || '',
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.images && product.images[0] ? product.images[0] : product.image,
          images: product.images || [product.image],
          category: product.category,
          quantity,
          customDetails: options.customDetails || null
        };
        return [...prevItems, newItem];
      }
    });

    addToast(`“${product.name}” কার্টে যোগ করা হয়েছে! 🌸`, 'success');
  };

  // Remove Item
  const removeItem = (cartId) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId));
    addToast('পণ্যটি কার্ট থেকে সরানো হয়েছে', 'info');
  };

  // Update Quantity
  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  // Clear Cart
  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Server-Validated Coupon Apply
  const applyCouponCode = async (code) => {
    if (!code || !code.trim()) {
      addToast('অনুগ্রহ করে কুপন কোড লিখুন', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          orderSubtotal: subtotal
        })
      });

      const data = await res.json();

      if (data.success) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          type: data.type
        });
        addToast(data.message || 'কুপন সফলভাবে যুক্ত হয়েছে! 🌸', 'success');
        return true;
      } else {
        addToast(data.message || 'অবৈধ কুপন কোড', 'error');
        return false;
      }
    } catch (e) {
      addToast('কুপন যাচাই করতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('কুপন কোড সরানো হয়েছে', 'info');
  };

  // Calculations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 5000 || subtotal === 0 ? 0 : 120;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        deliveryFee,
        discountAmount,
        grandTotal,
        appliedCoupon,
        isDrawerOpen,
        openCartDrawer: () => setIsDrawerOpen(true),
        closeCartDrawer: () => setIsDrawerOpen(false),
        lastCompletedOrder,
        setIsDrawerOpen,
        setLastCompletedOrder,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
