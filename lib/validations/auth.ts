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
  .min(1, 'phoneIsRequired')
  .regex(/^\d{9}$/, { message: 'phoneMustBe9Digits' });

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
    .min(1, 'codeRequired')
    .length(6, 'codeMustBe6Digits')
    .regex(/^\d+$/, 'codeMustBeDigits'),
});

export type OtpInput = z.infer<typeof otpSchema>;

// ---------------------------------------------------------------------------
// Phone + Password Login
// ---------------------------------------------------------------------------
export const phonePasswordSchema = z.object({
  phoneNumber: phoneSchema,
  password: z.string().min(1, 'passwordIsRequired').min(6, 'passwordMin6Chars'),
});

export type PhonePasswordInput = z.infer<typeof phonePasswordSchema>;

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
const registerShape = {
  phoneNumber: phoneSchema,
  // Zod v4: z.string().email() still works; z.email() also valid standalone
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  fullName: z.string().min(2, 'fullNameMin2Chars').max(100, 'fullNameTooLong'),
};

export const registerSchema = z.object(registerShape);

export type RegisterInput = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Phone + Password Registration
// ---------------------------------------------------------------------------
export const phonePasswordRegisterSchema = z.object({
  ...registerShape,
  password: z.string().min(1, 'passwordIsRequired').min(6, 'passwordMin6Chars'),
});

export type PhonePasswordRegisterInput = z.infer<
  typeof phonePasswordRegisterSchema
>;

// ---------------------------------------------------------------------------
// Admin User Creation
// ---------------------------------------------------------------------------
export const adminCreateUserSchema = z.object({
  name: z.string().min(2, 'fullNameMin2Chars').max(100, 'fullNameTooLong'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  role: z.enum(['user', 'admin'], { message: 'roleRequired' }),
  phoneNumbers: z.array(phoneSchema).min(1, 'atLeastOnePhoneRequired'),
  idCardNumber: z.string().min(1, 'idCardRequired').min(3, 'idCardMin3Chars'),
  locationPlan: z
    .string()
    .min(1, 'locationPlanRequired')
    .min(10, 'locationPlanMin10Chars'),
  photo: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB max
      { message: 'photoMaxSize5MB' },
    )
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'photoMustBeImage',
    }),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
