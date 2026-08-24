'use client';

import React, { useState } from 'react';
import { Flower2, Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'phulkini2026' || passcode === 'admin') {
      onLogin();
    } else {
      setError('ভুল পাসকোড! অনুগ্রহ করে সঠিক অ্যাডমিন পাসকোড দিন (ডিফল্ট: admin123)');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-bengali">
      <div className="card-luxury p-8 sm:p-10 max-w-md w-full bg-surface-white border-2 border-primary/20 shadow-soft-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white mx-auto shadow-soft">
            <Flower2 size={28} className="text-primary-light" />
          </div>
          <h1 className="text-2xl font-bold text-main-text">ফুল কিনি CMS অ্যাডমিন</h1>
          <p className="text-xs text-main-muted">
            পণ্য আপলোড, পরিবর্তন ও ক্যাটালগ নিয়ন্ত্রণের জন্য লগইন করুন।
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main-text mb-1 flex items-center gap-1">
              <KeyRound size={13} className="text-primary" />
              <span>অ্যাডমিন পাসকোড (Admin Passcode):</span>
            </label>
            <input
              type="password"
              placeholder="পাসকোড লিখুন (যেমন: admin123)"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl text-sm text-main-text focus:outline-none focus:border-primary font-mono text-center tracking-widest"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-600 mt-1.5 text-center leading-snug">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-primary-burgundy py-3 text-sm font-bold shadow-soft flex items-center justify-center gap-2"
          >
            <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 border-t border-border-subtle text-center text-xs text-main-subtle flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-accent-green" />
          <span>নিরাপদ ফ্লোরাল বুটিক ম্যানেজমেন্ট কনসোল</span>
        </div>
      </div>
    </div>
  );
}
