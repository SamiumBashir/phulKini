'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 px-4 rounded-xl shadow-soft-lg border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-[#FFFFFF] border-border-muted text-main-text'
              : toast.type === 'error'
              ? 'bg-[#FFF0F0] border-[#F5C2C7] text-[#842029]'
              : 'bg-[#FFFFFF] border-border-muted text-main-text'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <span className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                <CheckCircle2 size={16} />
              </span>
            ) : toast.type === 'error' ? (
              <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-700 shrink-0">
                <AlertCircle size={16} />
              </span>
            ) : (
              <span className="w-7 h-7 rounded-full bg-surface-light flex items-center justify-center text-secondary shrink-0">
                <Info size={16} />
              </span>
            )}
            <p className="text-sm font-medium text-main-text font-bengali leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-main-muted hover:text-primary transition-colors p-1 ml-2 rounded-lg hover:bg-surface-soft"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
