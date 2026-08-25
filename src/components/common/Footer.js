'use client';

import React from 'react';
import Link from 'next/link';
import {
  Flower2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  Heart,
  UserCheck
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C1010] text-[#E8DDD9] font-bengali pt-16 pb-12 mt-auto border-t border-primary-dark notranslate" translate="no">
      <div className="max-w-container mx-auto px-4 md:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#3B2828]">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#261717]/60 border border-[#422C2C]">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light shrink-0">
              <Flower2 size={20} />
            </span>
            <div>
              <h4 className="font-semibold text-white text-sm">১০০% সতেজ ফার্ম ফ্রেশ</h4>
              <p className="text-xs text-[#B5A4A0] mt-0.5">প্রতিদিন সকালে সরাসরি সংগ্রহ</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#261717]/60 border border-[#422C2C]">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light shrink-0">
              <Truck size={20} />
            </span>
            <div>
              <h4 className="font-semibold text-white text-sm">৩ ঘণ্টায় এক্সপ্রেস ডেলিভারি</h4>
              <p className="text-xs text-[#B5A4A0] mt-0.5">সমগ্র ঢাকায় দ্রুততম সার্ভিস</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#261717]/60 border border-[#422C2C]">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light shrink-0">
              <Sparkles size={20} />
            </span>
            <div>
              <h4 className="font-semibold text-white text-sm">আর্টিসান ফ্লোরাল ডিজাইন</h4>
              <p className="text-xs text-[#B5A4A0] mt-0.5">অভিজ্ঞ ফ্লোরিস্টদের হাতের ছোঁয়া</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#261717]/60 border border-[#422C2C]">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-light shrink-0">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h4 className="font-semibold text-white text-sm">১০০% নিরাপদ পেমেন্ট</h4>
              <p className="text-xs text-[#B5A4A0] mt-0.5">বিকাশ, নগদ, কার্ড ও সিওডি</p>
            </div>
          </div>
        </div>

        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 py-12">
          
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4 notranslate" translate="no">
            <Link href="/" className="flex items-center gap-2.5 notranslate" translate="no">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                <Flower2 size={20} />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight notranslate" translate="no">ফুল কিনি (Phul Kini)</span>
            </Link>
            <p className="text-sm text-[#C4B3AF] leading-relaxed">
              ফুল কিনি (Phul Kini) বাংলাদেশের একটি প্রিমিয়াম ফ্লোরাল বুটিক। ভালোবাসা, অনুভূতি আর জীবনের বিশেষ মুহূর্তগুলোকে তাজা ও নান্দনিক ফুলের সাজে রাঙিয়ে তোলাই আমাদের লক্ষ্য।
            </p>
            <div className="pt-2 text-xs text-[#A89692] italic notranslate" translate="no">
              “ভালোবাসা হোক ফুলের ভাষায়”
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-block px-3 py-1 bg-[#2C1919] border border-[#4D3131] rounded-full text-xs text-[#E8DDD9]">
                🌸 বনানী • গুলশান • ধানমন্ডি
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#3B2828] pb-2">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-2 text-sm text-[#C4B3AF]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  সব ফুল ও তোড়া
                </Link>
              </li>
              <li>
                <Link href="/shop?category=roses" className="hover:text-white transition-colors">
                  গোলাপ কালেকশন
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tulips" className="hover:text-white transition-colors">
                  ডাচ টিউলিপ
                </Link>
              </li>
              <li>
                <Link href="/custom-bouquet" className="hover:text-white transition-colors text-primary-light font-medium">
                  নিজের মতো তোড়া বানান ✨
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors text-amber-200/90 font-medium">
                  CMS অ্যাডমিন প্যানেল ⚙️
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#3B2828] pb-2">
              সহায়তা ও তথ্য
            </h3>
            <ul className="space-y-2 text-sm text-[#C4B3AF]">
              <li>
                <Link href="/order-confirmation" className="hover:text-white transition-colors">
                  অর্ডার ট্র্যাকিং
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  আমাদের গল্প
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  যোগাযোগ (Contact Us)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations (3 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#3B2828] pb-2">
              যোগাযোগ ও আউটলেট
            </h3>
            <div className="space-y-3 text-sm text-[#C4B3AF]">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-primary-light shrink-0 mt-0.5" />
                <span>হাউজ ১২, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-primary-light shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-white transition-colors">
                  ০১৭০০-০০০০০০, ০১৮০০-০০০০০০
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-primary-light shrink-0" />
                <a href="mailto:hello@phulkini.com" className="hover:text-white transition-colors">
                  support@phulkini.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-primary-light shrink-0" />
                <span>সকাল ৮:০০ – রাত ১১:০০ (প্রতিদিন)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3B2828] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9E8C88]">
          <p className="flex items-center gap-1.5 notranslate" translate="no">
            © ২০২৬ <strong className="text-white font-medium notranslate" translate="no">ফুল কিনি (Phul Kini)</strong>. সর্বস্বত্ব সংরক্ষিত। 
            <span className="hidden sm:inline">ভালোবাসা হোক ফুলের ভাষায়</span>
          </p>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#8C7A76] mr-1">নিরাপদ পেমেন্ট:</span>
            <span className="px-2 py-0.5 bg-[#2B1818] border border-[#482D2D] rounded text-[11px] font-sans font-semibold text-pink-300">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-[#2B1818] border border-[#482D2D] rounded text-[11px] font-sans font-semibold text-orange-300">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-[#2B1818] border border-[#482D2D] rounded text-[11px] font-sans font-semibold text-blue-300">
              VISA
            </span>
            <span className="px-2 py-0.5 bg-[#2B1818] border border-[#482D2D] rounded text-[11px] font-sans font-semibold text-red-300">
              MasterCard
            </span>
            <span className="px-2 py-0.5 bg-[#2B1818] border border-[#482D2D] rounded text-[11px] font-bengali text-amber-200">
              ক্যাশ অন ডেলিভারি
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-amber-300 hover:underline">
              CMS লগইন
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-white transition-colors">
              শর্তাবলী
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
