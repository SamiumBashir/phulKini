'use client';

import React, { useState, useRef } from 'react';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { useToast } from '@/context/ToastContext';
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Plus,
  Link as LinkIcon
} from 'lucide-react';

export default function CloudinaryUploader({ images = [], onChange }) {
  const { addToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        addToast(`“${file.name}” কোনো সঠিক ইমেজ ফাইল নয়`, 'error');
        continue;
      }

      try {
        const uploadedUrl = await uploadToCloudinary(file);
        if (uploadedUrl) {
          newImages.push(uploadedUrl);
        }
      } catch (err) {
        console.error('Upload failed:', err);
        addToast(`ইমেজ আপলোড ব্যর্থ হয়েছে: ${err.message}`, 'error');
      }
    }

    onChange(newImages);
    setIsUploading(false);
    addToast('ইমেজ সফলভাবে আপলোড সম্পন্ন হয়েছে! 🌸', 'success');
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    addToast('ইমেজ লিংক যুক্ত করা হয়েছে', 'success');
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-4 font-bengali">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary-subtle'
            : 'border-border-muted bg-surface-soft/60 hover:border-primary/60 hover:bg-surface-soft'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2 text-primary">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm font-semibold">Cloudinary-তে ইমেজ আপলোড হচ্ছে...</p>
            <p className="text-xs text-main-muted">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center shadow-sm">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-bold text-main-text">
              Cloudinary-তে ইমেজ আপলোড করতে ক্লিক বা ড্র্যাগ করুন
            </p>
            <p className="text-xs text-main-muted">
              PNG, JPG, WEBP ফরম্যাট সমর্থিত (একাধিক ছবি নির্বাচন করতে পারবেন)
            </p>
          </div>
        )}
      </div>

      {/* Manual URL Input Option */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-main-subtle" />
          <input
            type="url"
            placeholder="অথবা সরাসরি ইমেজ URL পেস্ট করুন..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-white border border-border-muted rounded-xl text-xs text-main-text focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 bg-surface-soft hover:bg-primary-light hover:text-primary text-main-text text-xs font-semibold rounded-xl border border-border-muted transition-colors"
        >
          যোগ করুন
        </button>
      </div>

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-main-text">
            নির্বাচিত ইমেজসমূহ ({images.length}টি):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group aspect-square rounded-2xl overflow-hidden border border-border-muted bg-surface-white shadow-soft-sm"
              >
                <img
                  src={img}
                  alt={`Upload preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    প্রধান ছবি
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  title="ইমেজ মুছুন"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
