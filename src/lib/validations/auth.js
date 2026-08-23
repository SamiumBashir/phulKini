import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন').trim(),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে').max(100),
  email: z.string().email('সঠিক ইমেইল দিন').trim(),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
  phone: z.string().optional()
});
