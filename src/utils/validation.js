import { z } from 'zod';

// Core Password Rules: Min 8 chars, 1 uppercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s\-]+$/, 'Only letters, spaces, and hyphens are allowed'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9]{10,14}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain an uppercase letter, a number, and a special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.password !== data.email, {
  message: 'Password cannot be identical to your email address',
  path: ['password'],
});