/**
 * Phul Kini - Official Business & Store Configuration
 * Single source of truth for boutique identity, helpline numbers, policies, and delivery constants.
 */

export const SITE_CONFIG = {
  name: 'ফুল কিনি (Phul Kini)',
  tagline: 'ভালোবাসা হোক ফুলের ভাষায়',
  description: 'ঢাকার সর্বাধুনিক ও নান্দনিক লাক্সারি অনলাইন ফ্লোরাল বুটিক। ১০০% সতেজ ফুল, হস্তশিল্পে র‍্যাপিং ও ৩ ঘণ্টায় এক্সপ্রেস ডেলিভারি।',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://phul-kini.vercel.app',
  
  contact: {
    phonePrimary: '+8801700-000000',
    phoneSecondary: '+8801800-000000',
    email: 'hello@phulkini.com',
    supportEmail: 'support@phulkini.com',
    address: 'হাউজ ১২, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩',
    hours: 'সকাল ৮:০০ – রাত ১১:০০ (প্রতিদিন)'
  },

  social: {
    facebook: 'https://facebook.com/phulkini',
    instagram: 'https://instagram.com/phulkini'
  },

  currency: {
    code: 'BDT',
    symbol: '৳',
    locale: 'bn-BD'
  },

  delivery: {
    freeThreshold: 5000,
    standardFeeDhaka: 120,
    expressFeeDhaka: 250,
    midnightFeeDhaka: 300,
    zones: [
      { id: 'dhaka_inside', name: 'ঢাকা সিটি (স্ট্যান্ডার্ড)', fee: 120 },
      { id: 'dhaka_express', name: 'ঢাকা এক্সপ্রেস (৩ ঘণ্টা)', fee: 250 },
      { id: 'dhaka_midnight', name: 'মিডনাইট সারপ্রাইজ (রাত ১২টা)', fee: 300 }
    ]
  },

  seo: {
    themeColor: '#610000',
    ogImage: '/og-image.jpg',
    keywords: [
      'ফুল কিনি',
      'Phul Kini',
      'Flower Delivery Dhaka',
      'Online Florist Bangladesh',
      'Fresh Roses Dhaka',
      'Bouquet Delivery',
      'Custom Flower Bouquet',
      'Midnight Flower Delivery'
    ]
  }
};

export default SITE_CONFIG;
