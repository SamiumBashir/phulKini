'use client';

import React, { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 font-bengali">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-xs text-main-muted">নিরাপদ সেশন যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <AdminDashboard
      user={currentUser}
      onLogout={() => setCurrentUser(null)}
    />
  );
}
