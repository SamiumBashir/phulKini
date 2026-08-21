'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const COUPONS = {
  'PHUL10': { code: 'PHUL10', discountPercent: 10, type: 'percent', minSpend: 0, label: '১০% বিশেষ ছাড়' },
  'BOSONTO20': { code: 'BOSONTO20', discountPercent: 20, type: 'percent', minSpend: 3000, label: '২০% বসন্ত অফার (ন্যূনতম ৳৩,০০০)' },
  'LOVE2026': { code: 'LOVE2026', discountAmount: 500, type: 'fixed', minSpend: 2500, label: '৳৫০০ ফ্ল্যাট ছাড় (ন্যূনতম ৳২,৫০০)' }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    address: '',
    area: 'বনানী / গুলশান',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliverySlot: 'morning',
    giftMessage: '',
    senderName: '',
    instructions: '',
    paymentMethod: 'bkash'
  });
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const { addToast } = useToast();

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('phul_kini_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('phul_kini_coupon');
      if (savedCoupon && COUPONS[savedCoupon]) {
        setAppliedCoupon(COUPONS[savedCoupon]);
      }
    } catch (e) {
      console.error('Failed to restore cart from localStorage', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('phul_kini_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, customDetails = null) => {
    setItems((prev) => {
      const cartItemId = customDetails 
        ? `${product.id}-${Date.now()}` 
        : product.id;

      const existingIndex = prev.findIndex((item) => item.cartId === (customDetails ? cartItemId : product.id));

      if (existingIndex > -1 && !customDetails) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem = {
          ...product,
          cartId: customDetails ? cartItemId : product.id,
          quantity,
          customDetails
        };
        return [...prev, newItem];
      }
    });

    addToast('আপনার কার্টে যোগ করা হয়েছে ✓', 'success');
  };

  const removeFromCart = (cartId) => {
    setItems((prev) => {
      const removed = prev.find((item) => item.cartId === cartId);
      if (removed) {
        addToast(`“${removed.name}” কার্ট থেকে সরানো হয়েছে`, 'info');
      }
      return prev.filter((item) => item.cartId !== cartId);
    });
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('phul_kini_cart');
      localStorage.removeItem('phul_kini_coupon');
    } catch (e) {}
  };

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = COUPONS[cleanCode];

    if (!coupon) {
      return { success: false, message: 'অকার্যকর কুপন কোড! অনুগ্রহ করে সঠিক কোড দিন।' };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        success: false,
        message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳ ${coupon.minSpend.toLocaleString('en-IN')} অর্ডার প্রয়োজন।`
      };
    }

    setAppliedCoupon(coupon);
    try {
      localStorage.setItem('phul_kini_coupon', cleanCode);
    } catch (e) {}

    addToast(`কুপন কোড “${cleanCode}” সফলভাবে যুক্ত হয়েছে! 🎉`, 'success');
    return { success: true, message: 'কুপন সফলভাবে অ্যাপ্লাই করা হয়েছে!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('phul_kini_coupon');
    } catch (e) {}
    addToast('কুপন বাতিল করা হয়েছে', 'info');
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  // Delivery Fee: ৳120 standard inside Dhaka, free over ৳5000
  const deliveryFee = subtotal > 0 ? (subtotal >= 5000 ? 0 : 120) : 0;

  // Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

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
        setIsDrawerOpen,
        openCartDrawer: () => setIsDrawerOpen(true),
        closeCartDrawer: () => setIsDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        deliveryInfo,
        setDeliveryInfo,
        lastCompletedOrder,
        setLastCompletedOrder
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
