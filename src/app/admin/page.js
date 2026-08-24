'use client';

import React, { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('phulkini_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('SessionStorage access error', e);
    }
    setIsMounted(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('phulkini_admin_auth', 'true');
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('phulkini_admin_auth');
    } catch (e) {}
  };

  if (!isMounted) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center font-bengali text-main-muted space-y-3">
        <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-main-muted font-medium">অ্যাডমিন প্যানেল লোড হচ্ছে...</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
