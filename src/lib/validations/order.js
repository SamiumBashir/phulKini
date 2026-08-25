import { z } from 'zod';

export const OrderItemInputSchema = z.object({
  productId: z.string().nullable().optional(),
  name: z.string().min(1, 'পণ্যের নাম আবশ্যক'),
  englishName: z.string().optional().default(''),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().optional(), // Server will re-validate against DB price
  quantity: z.number().int().min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে').max(100),
  customBouquetConfig: z.any().optional(),
  customDetails: z.any().optional()
});

export const OrderCreateSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1, 'কার্ট খালি হতে পারবে না'),
  delivery: z.object({
    name: z.string().min(2, 'পূর্ণ নাম আবশ্যক').max(100),
    phone: z.string().min(11, '১১ ডিজিটের মোবাইল নম্বর আবশ্যক').max(20),
    altPhone: z.string().optional().default(''),
    address: z.string().min(5, 'বিস্তারিত ঠিকানা আবশ্যক').max(300),
    area: z.string().default('বনানী'),
    city: z.string().default('ঢাকা'),
    zone: z.enum(['dhaka_inside', 'dhaka_express', 'dhaka_midnight']).default('dhaka_inside'),
    date: z.string().min(1, 'ডেলিভারি তারিখ আবশ্যক'),
    timeSlot: z.string().default('morning'),
    giftMessage: z.string().optional().default(''),
    instructions: z.string().optional().default('')
  }),
  couponCode: z.string().nullable().optional(),
  paymentMethod: z.enum(['bkash', 'nagad', 'card', 'cod']).default('cod')
});
