# ফুল কিনি (Phul Kini) — Premium Bengali Floral E-Commerce Platform (v2.0)

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![SSLCOMMERZ](https://img.shields.io/badge/SSLCOMMERZ-Payment%20Gateway-006699.svg?style=flat)](https://sslcommerz.com/)

**ফুল কিনি (Phul Kini)** বাংলাদেশের একটি প্রিমিয়াম অনলাইন ফ্লোরাল বুটিক ও গিফটিং প্ল্যাটফর্ম। তাজা ফার্ম-ফ্রেশ ফুল, আর্টিসান ফ্লোরাল ডিজাইন, লাইভ কাস্টম তোড়া বিল্ডার, রিয়েল-টাইম অর্ডার ট্র্যাকিং এবং সুরক্ষিত পেমেন্ট গেটওয়ের সমন্বয়ে এটি একটি আধুনিক প্রডাকশন-গ্রেড ই-কমার্স সমাধান।

---

## 🌟 প্রধান বৈশিষ্ট্যসমূহ (Key Features)

- 🌸 **সিগনেচার লাক্সারি ডিজাইন**: রয়্যাল বার্গান্ডি কালার প্যালেট (`#610000`), মার্জিত অফ-হোয়াইট ব্যাকগ্রাউন্ড (`#FCF9F8`), এবং পূর্ণাঙ্গ বাংলা টাইপোগ্রাফি।
- 🛡️ **প্রডাকশন-গ্রেড অথেন্টিকেশন ও RBAC**: `bcryptjs` পাসওয়ার্ড হ্যাশিং, `HttpOnly; Secure; SameSite=Lax` কুকি-ভিত্তিক সাইনড JWT সেশন এবং `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `CUSTOMER` রোলভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ।
- 🌿 **MongoDB Atlas ডাটাবেস**: `User`, `Product`, `Category`, `Order`, `Coupon`, `Review`, `AuditLog` মডেল সমৃদ্ধ অপ্টিমাইজড সার্ভারলেস ডাটাবেস।
- 💰 **সার্ভার-সাইড মূল্য ও স্টক ভ্যালিডেশন**: ক্লায়েন্ট-সাইড কোনো মূল্য বা ডিসকাউন্ট বিশ্বাস না করে সার্ভার ডাটাবেস থেকে সঠিক মূল্য ও অ্যাটমিক স্টক ডিক্রিমেন্ট নিশ্চিত করে।
- 💳 **SSLCOMMERZ ও ক্যাশ অন ডেলিভারি (COD)**: বিকাশ, নগদ, ভিসা, মাস্টারকার্ড ও ইনস্ট্যান্ট পেমেন্ট নোটিফিকেশন (IPN) যাচাইকরণ।
- ☁️ **সাইনড Cloudinary মিডিয়া আপলোড**: সার্ভার-ভেরিফাইড সিগনেচার দিয়ে সরাসরি ক্লাউডিনারি আপলোড (JPG, PNG, WebP সর্বোচ্চ ৫MB)।
- 🎨 **ইন্টারেক্টিভ ৮-স্টেপ তোড়া বিল্ডার**: ফুল নির্বাচন, র‍্যাপিং পেপার, রিবন, সুগন্ধি, কার্ড মেসেজ ও স্পেশাল গিফট অ্যাড-অন।
- 🚚 **লাইভ ৪-স্টেপ অর্ডার ট্র্যাকিং**: অর্ডার নম্বর ও ফোন নম্বর দিয়ে রিয়েল-টাইম ডেলিভারি স্ট্যাটাস ট্র্যাকিং।
- ⚙️ **পূর্ণাঙ্গ অ্যাডমিন CMS ও অ্যানালিটিক্স**: লাইভ রেভিনিউ, অপেক্ষমাণ অর্ডার, ফুল যোগ/সম্পাদনা/ডিলিট ও অর্ডার প্রসেসিং।

---

## 🛠️ প্রযুক্তি স্ট্যাক (Technology Stack)

| কম্পোনেন্ট | প্রযুক্তি |
|---|---|
| **ফ্রেমওয়ার্ক** | Next.js 15 (App Router), React 19 |
| **স্টাইলিং** | Tailwind CSS, Lucide Icons, Canvas Confetti |
| **ডাটাবেস** | MongoDB Atlas, Mongoose ODM |
| **ক্যাশিং ও রেট-লিমিট** | Redis (ioredis) ও ইন-মেমোরি ফলব্যাক |
| **অথেন্টিকেশন** | Jose JWT, BcryptJS, HttpOnly Secure Cookies |
| **ভ্যালিডেশন** | Zod Schema Validation |
| **পেমেন্ট গেটওয়ে** | SSLCOMMERZ (Sandbox & Live Support) |
| **মিডিয়া স্টোরেজ** | Cloudinary Signed Uploads |

---

## 🚀 লোকাল সেটআপ গাইড (Local Setup Guide)

### ১. রিপোজিটরি ক্লোন করুন
```bash
git clone https://github.com/SamiumBashir/phulKini.git
cd phulKini
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

### ৩. এনভায়রনমেন্ট ভেরিয়েবল কনফিগার করুন
`.env.example` থেকে `.env.local` ফাইল তৈরি করুন:
```bash
cp .env.example .env.local
```

`.env.local` ফাইলটি আপনার প্রয়োজনীয় কনফিগারেশন দিয়ে সাজান:
```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/phul_kini
MONGODB_DB=phul_kini

# Auth & Security
AUTH_SECRET=your_super_secret_jwt_key_2026

# Initial Super Admin Seed Credentials
INITIAL_ADMIN_NAME="ফুল কিনি সুপার অ্যাডমিন"
INITIAL_ADMIN_EMAIL=admin@phulkini.com
INITIAL_ADMIN_PASSWORD=admin123
INITIAL_ADMIN_PHONE=01700000000

# Cloudinary
CLOUDINARY_CLOUD_NAME=phulkini
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SSLCOMMERZ
SSLCOMMERZ_STORE_ID=phulkinitest
SSLCOMMERZ_STORE_PASSWORD=phulkinitest@ssl
SSLCOMMERZ_IS_LIVE=false
```

### ৪. ডাটাবেস সিড করুন (Database Seed)
```bash
node src/scripts/seed.js
```

### ৫. ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`  
অ্যাডমিন প্যানেল: `http://localhost:3000/admin` (Email: `admin@phulkini.com` / Password: `admin123`)

---

## 🔒 সিকিউরিটি আর্কিটেকচার (Security Architecture)

1. **Zero-Trust Pricing**: ফ্রন্টএন্ড থেকে পাঠানো পণ্যমূল্য সার্ভারে ডাটাবেস রেকর্ডের সাথে যাচাই করা হয়।
2. **Atomic Inventory**: একাধিক গ্রাহক একই সময়ে অর্ডার করলে যাতে ওভারসেলিং না হয়, সেজন্য `$inc: { stock: -quantity }` ব্যবহৃত হয়।
3. **Rate Limiting**: প্রতিটি আইপি থেকে অতিরিক্ত লগইন চেষ্টা (১০টি/১৫ মিনিট) এবং কুপন পরীক্ষা রোধ করা হয়।
4. **Content Security Policy**: X-Frame-Options: DENY, X-Content-Type-Options: nosniff এবং সাইনড সিকিউর কুকিজ।
5. **Customer Privacy**: গেস্ট অর্ডার ট্র্যাকিংয়ে অর্ডার নম্বর ও ফোন নম্বরের দ্বৈত ভেরিফিকেশন ছাড়া সংবেদনশীল তথ্য প্রদর্শিত হয় না।

---

## 📄 লাইসেন্স (License)

প্রজেক্টটি **MIT License** এর অধীনে মুক্তভাবে ব্যবহারের জন্য উন্মুক্ত।

© ২০২৬ **ফুল কিনি (Phul Kini)** — ভালোবাসা হোক ফুলের ভাষায় 🌸
