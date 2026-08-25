'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Flower2, ArrowRight, AlertCircle, Mail, Key } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@phulkini.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (data.success) {
        addToast(`স্বাগতম ${data.user.name}! 🌸`, 'success');
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        setError(data.message || 'ভুল তথ্য! আবার চেষ্টা করুন।');
        addToast(data.message || 'লগইন ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      setError('সার্ভারে সংযোগ স্থাপন করা সম্ভব হয়নি');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-bengali">
      <div className="w-full max-w-md bg-white border border-[#E8DDD9] rounded-3xl shadow-luxury p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-md transform -rotate-3">
            <Flower2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-main-text">ফুল কিনি অ্যাডমিন CMS</h1>
            <p className="text-xs text-main-muted mt-1">
              নিরাপদ সার্ভার-সাইড ভেরিফিকেশন প্যানেল (Phul Kini v2)
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-main-text mb-1.5">
              অ্যাডমিন ইমেইল
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phulkini.com"
                className="w-full p-3.5 pl-10 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-muted" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-main-text mb-1.5">
              সিক্রেট পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 pl-10 bg-[#FCF9F8] border border-[#D9C8C4] rounded-xl text-main-text font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
              <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary-burgundy py-3.5 rounded-xl text-sm font-bold shadow-soft flex items-center justify-center gap-2 mt-6 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span>যাচাই হচ্ছে...</span>
            ) : (
              <>
                <span>লগইন করুন</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#F0E6E3] flex items-center justify-center gap-2 text-[11px] text-main-muted">
          <ShieldCheck size={14} className="text-accent-green" />
          <span>256-bit এনক্রিপশন ও HttpOnly সিকিউর সেশন</span>
        </div>
      </div>
    </div>
  );
}
