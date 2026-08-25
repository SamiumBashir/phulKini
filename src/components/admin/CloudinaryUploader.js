'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function CloudinaryUploader({ onImagesUploaded, initialImages = [] }) {
  const [images, setImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 1. Client Type & Size validation
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        addToast('শুধুমাত্র JPG, PNG বা WebP ছবি গ্রহণযোগ্য', 'error');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        addToast('ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে', 'error');
        continue;
      }

      try {
        setUploadProgress(30 + Math.round((i / files.length) * 40));

        // 2. Request signed upload signature from backend
        const signRes = await fetch('/api/uploads/sign', { method: 'POST' });
        const signData = await signRes.json();

        if (signData.success && signData.apiKey && signData.apiKey !== '123456789012345') {
          // Real Cloudinary signed upload
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', signData.apiKey);
          formData.append('timestamp', signData.timestamp);
          formData.append('signature', signData.signature);
          formData.append('folder', signData.folder);

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
            { method: 'POST', body: formData }
          );
          const cloudData = await cloudRes.json();

          if (cloudData.secure_url) {
            uploadedUrls.push(cloudData.secure_url);
          }
        } else {
          // Dev local FileReader preview fallback
          const localUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          uploadedUrls.push(localUrl);
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);

    if (uploadedUrls.length > 0) {
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      if (onImagesUploaded) {
        onImagesUploaded(newImages);
      }
      addToast(`${uploadedUrls.length}টি ছবি সফলভাবে যুক্ত হয়েছে! 🌸`, 'success');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    if (onImagesUploaded) {
      onImagesUploaded(updated);
    }
  };

  return (
    <div className="space-y-4 font-bengali">
      <label className="block text-xs font-bold text-main-text uppercase tracking-wider">
        পণ্যের ছবি আপলোড (Cloudinary Signed Media)
      </label>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-primary bg-primary-light/30 scale-[1.01]'
            : 'border-[#D9C8C4] hover:border-primary/60 bg-[#FCF9F8]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="py-4 space-y-3">
            <Loader2 size={32} className="animate-spin text-primary mx-auto" />
            <p className="text-xs font-semibold text-main-text">
              ছবি প্রসেস ও আপলোড হচ্ছে... ({uploadProgress}%)
            </p>
            <div className="w-48 h-1.5 bg-[#E8DDD9] rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-main-text">
                ছবি নির্বাচন করতে ক্লিক করুন অথবা এখানে টেনে আনুন
              </p>
              <p className="text-[11px] text-main-muted mt-0.5">
                সমর্থিত ফরম্যাট: JPG, PNG, WebP (সর্বোচ্চ ৫ মেগাবাইট প্রতি ছবি)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-[#D9C8C4] aspect-square bg-[#FCF9F8]"
            >
              <img
                src={imgUrl}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(idx);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 shadow-md transition-all cursor-pointer"
              >
                <X size={13} />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  প্রধান ছবি
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
