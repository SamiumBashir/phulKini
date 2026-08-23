import { z } from 'zod';

export const ProductCreateSchema = z.object({
  name: z.string().min(2, 'বাংলা নাম আবশ্যক').max(150),
  englishName: z.string().optional().default(''),
  category: z.string().min(1, 'ক্যাটাগরি আবশ্যক'),
  categoryName: z.string().optional().default('ফুলের তোড়া'),
  price: z.number().positive('মূল্য ধনাত্মক সংখ্যা হতে হবে'),
  originalPrice: z.number().nullable().optional(),
  compareAtPrice: z.number().nullable().optional(),
  stock: z.number().int().min(0, 'স্টক ঋণাত্মক হতে পারবে না').default(50),
  images: z.array(z.any()).min(1, 'কমপক্ষে ১টি ছবি আবশ্যক'),
  shortDescription: z.string().optional().default(''),
  description: z.string().optional().default(''),
  stemCount: z.string().optional().default('১২টি তাজা ফুল ও ফিলার'),
  lifespan: z.string().optional().default('৫-৭ দিন'),
  fragrance: z.string().optional().default('মিষ্টি প্রাকৃতিক সুবাস'),
  wrapping: z.string().optional().default('সিগনেচার বার্গান্ডি ম্যাট র‍্যাপিং'),
  occasions: z.array(z.string()).default(['love', 'birthday']),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  inStock: z.boolean().default(true)
});

export const ProductUpdateSchema = ProductCreateSchema.partial();
