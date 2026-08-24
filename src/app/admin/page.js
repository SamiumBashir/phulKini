'use client';

import React, { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('phulkini_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
    setIsChecking(false);
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

  if (isChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-bengali text-main-muted">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
