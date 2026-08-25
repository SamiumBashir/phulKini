import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../lib/db/mongodb.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import { PRODUCTS } from '../data/products.js';
import { CATEGORIES } from '../data/categories.js';

export async function seedDatabase() {
  console.log('🌱 Starting Phul Kini database seed...');
  await connectToDatabase();

  // 1. Seed Super Admin
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@phulkini.com').toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'PhulKini@Admin2026Secure!';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name: process.env.INITIAL_ADMIN_NAME || 'ফুল কিনি সুপার অ্যাডমিন',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      phone: process.env.INITIAL_ADMIN_PHONE || '01700000000',
      isActive: true
    });
    console.log(`✅ Super Admin created: ${adminEmail} (Role: SUPER_ADMIN)`);
  } else {
    console.log(`ℹ️ Super Admin already exists: ${adminEmail}`);
  }

  // 2. Seed Categories
  const existingCategoriesCount = await Category.countDocuments();
  if (existingCategoriesCount === 0) {
    const categoryDocs = CATEGORIES.filter((c) => c.slug !== 'all').map((c, idx) => ({
      name: c.name,
      englishName: c.englishName || '',
      slug: c.slug,
      icon: c.icon || '🌸',
      description: c.description || '',
      isActive: true,
      sortOrder: idx
    }));
    await Category.insertMany(categoryDocs);
    console.log(`✅ Seeded ${categoryDocs.length} floral categories`);
  }

  // 3. Seed Products
  const existingProductsCount = await Product.countDocuments();
  if (existingProductsCount === 0) {
    const productDocs = PRODUCTS.map((p) => {
      const images =
        p.images && p.images.length > 0
          ? p.images
          : [p.image || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000&auto=format&fit=crop'];

      return {
        name: p.name,
        englishName: p.englishName || '',
        slug: p.slug || p.id,
        category: p.category || 'bouquets',
        categoryName: p.categoryName || 'ফুলের তোড়া',
        price: p.price,
        originalPrice: p.originalPrice || null,
        compareAtPrice: p.originalPrice || null,
        discountPercent: p.discountPercent || 0,
        images: images,
        stock: 50,
        isAvailable: true,
        inStock: true,
        isFeatured: !!p.isFeatured,
        isBestseller: !!p.isBestseller,
        isNew: !!p.isNew,
        shortDescription: p.shortDescription || '',
        description: p.description || p.shortDescription || '',
        stemCount: p.stemCount || '১২টি তাজা ফুল ও ফিলার',
        lifespan: p.lifespan || '৫-৭ দিন',
        fragrance: p.fragrance || 'মিষ্টি প্রাকৃতিক সুবাস',
        wrapping: p.wrapping || 'সিগনেচার বার্গান্ডি ম্যাট র‍্যাপিং',
        occasions: p.occasions || ['love', 'birthday'],
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 0,
        tags: [p.category, ...(p.occasions || [])]
      };
    });

    await Product.insertMany(productDocs);
    console.log(`✅ Seeded ${productDocs.length} boutique floral products`);
  }

  // 4. Seed Coupons
  const existingCouponsCount = await Coupon.countDocuments();
  if (existingCouponsCount === 0) {
    const initialCoupons = [
      {
        code: 'PHUL10',
        type: 'percentage',
        value: 10,
        minOrderAmount: 1500,
        maxDiscount: 1000,
        usageLimit: 1000,
        isActive: true,
        description: 'যেকোনো অর্ডারে ১০% মূল্যছাড় (সর্বোচ্চ ৳১,০০০)'
      },
      {
        code: 'BOSONTO20',
        type: 'percentage',
        value: 20,
        minOrderAmount: 3000,
        maxDiscount: 2000,
        usageLimit: 500,
        isActive: true,
        description: 'বসন্ত স্পেশাল ২০% ছাড় (ন্যূনতম অর্ডার ৳৩,০০০)'
      },
      {
        code: 'LOVE2026',
        type: 'fixed',
        value: 500,
        minOrderAmount: 4000,
        maxDiscount: 500,
        usageLimit: 250,
        isActive: true,
        description: '৳৪,০০০+ অর্ডারে ফ্ল্যাট ৳৫০০ ইনস্ট্যান্ট ছাড়'
      }
    ];

    await Coupon.insertMany(initialCoupons);
    console.log(`✅ Seeded ${initialCoupons.length} live discount coupons`);
  }

  console.log('🌸 Database seed completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seed error:', err);
      process.exit(1);
    });
}
