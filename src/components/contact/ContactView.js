'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function ContactView() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'সাধারণ জিজ্ঞাসা',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      addToast('অনুগ্রহ করে নাম, ফোন এবং বার্তা পূরণ করুন', 'error');
      return;
    }

    setIsSubmitted(true);
    addToast('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।', 'success');
  };

  const outlets = [
    {
      name: 'বনানী ফ্ল্যাগশিপ আউটলেট',
      address: 'হাউজ ১২, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩',
      phone: '+8801700-000001',
      hours: 'সকাল ৮:০০ – রাত ১১:০০ (প্রতিদিন)',
      mapUrl: 'https://maps.google.com/?q=Banani+11+Dhaka'
    },
    {
      name: 'গুলশান এক্সক্লুসিভ স্টুডিও',
      address: 'সাউথ এভিনিউ, গুলশান-২, ঢাকা-১২১২',
      phone: '+8801700-000002',
      hours: 'সকাল ৮:০০ – রাত ১১:০০ (প্রতিদিন)',
      mapUrl: 'https://maps.google.com/?q=Gulshan+2+Dhaka'
    },
    {
      name: 'ধানমন্ডি বুটিক শপ',
      address: 'হাউজ ৪৪, রোড ২৭ (পুরাতন), ধানমন্ডি, ঢাকা-১২০৯',
      phone: '+8801700-000003',
      hours: 'সকাল ৯:০০ – রাত ১০:০০ (প্রতিদিন)',
      mapUrl: 'https://maps.google.com/?q=Dhanmondi+27+Dhaka'
    }
  ];

  return (
    <div className="py-8 sm:py-16 font-bengali">
      <div className="max-w-container mx-auto px-4 md:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold">
            <Sparkles size={13} />
            আমরা আছি আপনার পাশে • Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-main-text leading-tight">
            যোগাযোগ (Contact Us)
          </h1>
          <p className="text-xs sm:text-sm text-main-muted leading-relaxed max-w-lg mx-auto">
            যেকোনো কাস্টম ফুলের তোড়া, সারপ্রাইজ ডেলিভারি কিংবা ইভেন্ট ডেকোরেশনের প্রয়োজনে আমাদের সাথে সরাসরি কথা বলুন বা আউটলেটে চলে আসুন।
          </p>
        </div>

        {/* 3 Outlets Directory Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-main-text flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              <span>আমাদের বুটিক আউটলেটসমূহ</span>
            </h2>
            <span className="text-xs text-main-muted hidden sm:inline">
              ঢাকা শহরের ৩টি প্রধান লোকেশনে
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outlets.map((outlet, idx) => (
              <div
                key={idx}
                className="card-luxury p-6 bg-surface-white space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                      {idx + 1}
                    </span>
                    <a
                      href={outlet.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>ম্যাপ দেখুন</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <h3 className="font-bold text-base text-main-text">{outlet.name}</h3>
                  <p className="text-xs text-main-muted leading-relaxed mt-1">{outlet.address}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border-subtle text-xs text-main-muted">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-primary shrink-0" />
                    <a href={`tel:${outlet.phone}`} className="hover:text-primary font-sans font-medium text-main-text">
                      {outlet.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-primary shrink-0" />
                    <span>{outlet.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form & Hotline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 card-luxury p-6 sm:p-8 bg-surface-white space-y-5">
            <div>
              <h2 className="text-xl font-bold text-main-text">
                আমাদের একটি বার্তা পাঠান
              </h2>
              <p className="text-xs text-main-muted mt-1">
                আপনার বার্তা পাওয়ার পর আমাদের ফ্লোরিস্ট প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-accent-green-light border border-accent-green/30 text-accent-green text-center space-y-3">
                <CheckCircle2 size={40} className="mx-auto" />
                <h3 className="font-bold text-lg">ধন্যবাদ! আপনার বার্তা গৃহীত হয়েছে</h3>
                <p className="text-xs max-w-sm mx-auto">
                  আমাদের একজন ফ্লোরাল কনসালট্যান্ট অতি দ্রুত আপনার মোবাইল নম্বরে যোগাযোগ করবেন।
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      subject: 'সাধারণ জিজ্ঞাসা',
                      message: ''
                    });
                  }}
                  className="btn-primary-burgundy text-xs py-2 px-5 mt-2"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      আপনার নাম <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      মোবাইল নম্বর <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="০১৭১১-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl focus:outline-none focus:border-primary font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-main-text mb-1">
                      বিষয়
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="সাধারণ জিজ্ঞাসা">সাধারণ জিজ্ঞাসা</option>
                      <option value="কাস্টম তোড়া পরামর্শ">কাস্টম তোড়া পরামর্শ</option>
                      <option value="বিবাহ বা ইভেন্ট ডেকোর">বিবাহ বা ইভেন্ট ডেকোর</option>
                      <option value="অর্ডার স্ট্যাটাস ও ডেলিভারি">অর্ডার স্ট্যাটাস ও ডেলিভারি</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-main-text mb-1">
                    আপনার বার্তা <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="আপনার প্রশ্ন বা ফুলের চাহিদা সম্পর্কে বিস্তারিত লিখুন..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-surface-soft border border-border-muted rounded-xl focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-burgundy py-3 px-8 text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                  <Send size={15} />
                  <span>বার্তা পাঠান</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Hotline, WhatsApp & Direct Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hotline Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#2D0B0B] text-white shadow-soft space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-pink-300">
                <Phone size={20} />
              </div>
              <h3 className="text-xl font-bold">সরাসরি কথা বলুন (Hotline)</h3>
              <p className="text-xs text-pink-100/80 leading-relaxed">
                জরুরি অর্ডার, মিডনাইট সারপ্রাইজ ডেলিভারি কিংবা যেকোনো জিজ্ঞাসার জন্য কল করুন।
              </p>
              <div className="text-2xl font-bold text-amber-300 font-sans tracking-wide pt-1">
                +8801700-000000
              </div>
              <div className="space-y-1 text-xs text-pink-200/80 pt-1 border-t border-white/10">
                <p>⏰ সকাল ৮:০০ – রাত ১১:০০ (সপ্তাহে ৭ দিন)</p>
                <p>✉️ support@phulkini.com</p>
              </div>
            </div>

            {/* WhatsApp Consultation */}
            <div className="p-6 rounded-3xl bg-surface-white border border-border-muted shadow-soft space-y-3 text-xs text-main-muted">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <MessageCircle size={18} className="text-emerald-600" />
                <h4 className="text-main-text">ফ্লোরিস্টের সাথে WhatsApp চ্যাট</h4>
              </div>
              <p className="leading-relaxed">
                পছন্দের কোনো ডিজাইনের ছবি পাঠিয়ে কিংবা বাজেট বলে সরাসরি ফ্লোরিস্টের কাছ থেকে পরামর্শ নিন।
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full btn-secondary-outline text-xs py-2.5 px-4 flex items-center justify-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp এ কথা বলুন</span>
                </a>
              </div>
            </div>

            {/* Quick FAQ Link */}
            <div className="p-4 rounded-2xl bg-surface-soft border border-border-subtle flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-main-muted">
                <HelpCircle size={16} className="text-primary" />
                <span>সাধারণ প্রশ্নগুলোর উত্তর জানতে চান?</span>
              </div>
              <Link href="/faq" className="text-primary font-bold hover:underline">
                FAQ দেখুন →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
