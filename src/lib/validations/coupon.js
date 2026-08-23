import { z } from 'zod';

export const CouponValidateSchema = z.object({
  code: z.string().min(2, 'কুপন কোড আবশ্যক').trim().toUpperCase(),
  orderSubtotal: z.number().min(0, 'সাবটোটাল আবশ্যক')
});

export const CouponCreateSchema = z.object({
  code: z.string().min(2, 'কুপন কোড আবশ্যক').trim().toUpperCase(),
  type: z.enum(['percentage', 'fixed']).default('percentage'),
  value: z.number().positive('কুপনের মান ধনাত্মক সংখ্যা হতে হবে'),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional().default('')
});
