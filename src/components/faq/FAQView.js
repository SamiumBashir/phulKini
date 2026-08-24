'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, HelpCircle, Phone, ArrowRight } from 'lucide-react';

export default function FAQView() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'ফুল কিনিতে কি তাজা ফুল নিশ্চিত করা হয়?',
      a: 'হ্যাঁ, সম্পূর্ণভাবে। আমরা প্রতিদিন ভোরে সরাসরি নির্বাচিত ফ্লাওয়ার গার্ডেন ও নেদারল্যান্ডসের অকশন থেকে ফুল সংগ্রহ করি। কোনো প্রকার পুরোনো বা কৃত্রিম ফুল আমরা ব্যবহার করি না।'
    },
    {
      q: 'ঢাকায় কত সময়ের মধ্যে ডেলিভারি পাওয়া সম্ভব?',
      a: 'আমাদের এক্সপ্রেস সার্ভিসের মাধ্যমে সমগ্র ঢাকা সিটির ভেতরে ৩ ঘণ্টার মধ্যে তাজা ফুল পৌঁছে দেওয়া হয়। এছাড়াও আপনি আপনার পছন্দমতো ভবিষ্যতের যেকোনো তারিখ ও সময় স্লট নির্ধারণ করে অগ্রিম বুকিং দিতে পারেন।'
    },
    {
      q: 'রাত ১২:০০ টার মিডনাইট সারপ্রাইজ ডেলিভারি কি সম্ভব?',
      a: 'হ্যাঁ! জন্মদিন বা বিবাহবার্ষিকীর জন্য রাত ১১:৩০ থেকে ১২:৩০ এর মধ্যে আমাদের বিশেষ “মিডনাইট সারপ্রাইজ” ডেলিভারি রয়েছে। চেকআউটের সময় ডেলিভারি স্লট থেকে এটি নির্বাচন করুন।'
    },
    {
      q: 'কাস্টম তোড়া (নিজের পছন্দের ফুল দিয়ে) কীভাবে বানাবো?',
      a: 'আমাদের ওয়েবসাইটের “তোড়া বানান” সেকশনে গিয়ে আপনি আপনার পছন্দের ফুল, স্টেম সংখ্যা, রঙের থিম, র‍্যাপিং পেপার ও ফ্রি গ্রিটিং কার্ড পছন্দ করে সম্পূর্ণ ইউনিক তোড়া তৈরি করতে পারেন।'
    },
    {
      q: 'পেমেন্ট কীভাবে করা যায়?',
      a: 'আমরা বিকাশ (bKash), নগদ (Nagad), ভিসা ও মাস্টারকার্ড সহ সকল প্রধান কার্ড এবং ক্যাশ অন ডেলিভারি (সিওডি) সমর্থন করি। পেমেন্ট সম্পূর্ণ 256-bit এনক্রিপশনে সুরক্ষিত।'
    },
    {
      q: 'ফুল পছন্দ না হলে বা ক্ষতিগ্রস্ত হলে রিপ্লেসমেন্ট পলিসি কী?',
      a: 'ডেলিভারির সময় ফুল ক্ষতিগ্রস্ত হলে বা অসন্তোষজনক মনে হলে ডেলিভারির ১ ঘণ্টার মধ্যে আমাদের হেল্পলাইনে জানালে আমরা তাৎক্ষণিকভাবে বিনামূল্যে নতুন তোড়া রিপ্লেস করে দিই।'
    }
  ];

  return (
    <div className="py-8 sm:py-16 font-bengali">
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold">
            <Sparkles size={13} />
            সাধারণ জিজ্ঞাসা
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-main-text">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-main-muted">
            অর্ডার, ডেলিভারি ও ফুলের যত্ন সংক্রান্ত যাবতীয় তথ্যের উত্তর এখানে পাবেন।
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card-luxury overflow-hidden bg-surface-white transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-main-text hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={18} className="text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-main-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-main-muted leading-relaxed border-t border-border-subtle/60 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="p-6 rounded-3xl bg-primary-subtle border border-border-muted text-center space-y-3">
          <h3 className="font-bold text-base text-primary">আরও কিছু জানতে চান?</h3>
          <p className="text-xs text-main-muted">
            আমাদের কাস্টমার রিলেশনশিপ টিম আপনার প্রশ্নের উত্তর দিতে সার্বক্ষণিক প্রস্তুত।
          </p>
          <div className="pt-1">
            <Link
              href="/contact"
              className="btn-primary-burgundy text-xs py-2 px-5 inline-flex items-center gap-1.5"
            >
              <Phone size={13} />
              <span>সাপোর্টে যোগাযোগ করুন</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
