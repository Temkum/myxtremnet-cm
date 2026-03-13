/**
 *
 * Zod v4 compatible schemas.
 *
 * Key Zod v4 changes from v3:
 * - z.string().regex() still works but chaining order matters less
 * - Error codes changed: "invalid_string" -> "invalid_format"
 * - z.email(), z.url() etc. are now first-class string formats
 * - .min() on empty string still triggers, so we don't need a separate
 *   .nonempty() — but message must be on .min(1)
 *
 * Requires: zod >= 3.25.0 (exports zod/v4/core used by @hookform/resolvers)
 * Requires: @hookform/resolvers >= 5.0.1
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Phone — E.164 format. Cameroon: +237 followed by 9 digits.
// Defined as a standalone schema so it can be reused and tested in isolation.
// ---------------------------------------------------------------------------
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\d{9}$/, { message: 'Phone number must be exactly 9 digits' });

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  phoneNumber: phoneSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// OTP — validated separately from the phone step
// ---------------------------------------------------------------------------
export const otpSchema = z.object({
  phoneNumber: phoneSchema,
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only digits'),
});

export type OtpInput = z.infer<typeof otpSchema>;

// ---------------------------------------------------------------------------
// Phone + Password Login
// ---------------------------------------------------------------------------
export const phonePasswordSchema = z.object({
  phoneNumber: phoneSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type PhonePasswordInput = z.infer<typeof phonePasswordSchema>;

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
const registerShape = {
  phoneNumber: phoneSchema,
  // Zod v4: z.string().email() still works; z.email() also valid standalone
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
};

export const registerSchema = z.object(registerShape);

export type RegisterInput = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Phone + Password Registration
// ---------------------------------------------------------------------------
export const phonePasswordRegisterSchema = z.object({
  ...registerShape,
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type PhonePasswordRegisterInput = z.infer<
  typeof phonePasswordRegisterSchema
>;
