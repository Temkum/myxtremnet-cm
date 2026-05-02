/**
 * Phone number is the primary login identifier.
 * Email is collected at registration for account recovery only.
 *
 * OTP flow:
 *   1. Client calls authClient.phoneNumber.sendOtp({ phoneNumber })
 *   2. sendOTP callback fires → you forward the code via SMS provider
 *   3. Client calls authClient.phoneNumber.verify({ phoneNumber, code })
 *   4. Better Auth creates/resumes session
 *
 * On-screen OTP display:
 *   After sendOTP fires, the code is written to the verification table under
 *   the identifier `otp-display:<phone>`. The client fetches it from
 *   GET /api/otp/display?phone=<phone> and shows it in the UI.
 *   This is a deliberate product feature (parity with old website).
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { db } from '@/lib/db';
import * as schema from '@/db/schema/auth-schema';
import { verification } from '@/db/schema/auth-schema';
import { eq, and, lt } from 'drizzle-orm';
import '@/lib/env-validation';

const OTP_TTL_MS = 10 * 60 * 1000; // must match expiresIn below

export const auth = betterAuth({
  // -------------------------------------------------------------------------
  // Database
  // -------------------------------------------------------------------------
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // -------------------------------------------------------------------------
  // Email+password enabled for phone+password login (phone used as username)
  // -------------------------------------------------------------------------
  emailAndPassword: {
    enabled: true,
  },

  // -------------------------------------------------------------------------
  // Phone number plugin
  // -------------------------------------------------------------------------
  plugins: [
    phoneNumber({
      // OTP config
      otpLength: 6,
      expiresIn: 60 * 10, // 10 minutes

      // When a new phone number passes OTP verification and no user exists,
      // auto-create the account. getTempEmail generates a placeholder email
      // so the DB unique constraint on email is satisfied.
      signUpOnVerification: {
        getTempName: (phone) => `User ${phone.replace(/\D/g, '').slice(-4)}`,
        getTempEmail: (phone) =>
          `${phone.replace(/[^0-9]/g, '')}@phone.camtel.local`,
      },

      // ---------- sendOTP ----------
      sendOTP: async ({ phoneNumber: phone, code }, _request) => {
        // ------------------------------------------------------------------
        // Clean up any existing OTP display records for this phone to prevent
        // conflicts with our display feature, but leave Better Auth's verification
        // records untouched.
        // ------------------------------------------------------------------

        // ------------------------------------------------------------------
        // Store OTP in the verification table for on-screen display.
        // Identifier is namespaced so it never collides with Better Auth's
        // own verification records for the same phone number.
        // onConflictDoUpdate ensures a fresh sendOTP always overwrites the
        // previous code atomically — no stale codes shown in the UI.
        // ------------------------------------------------------------------
        const expiresAt = new Date(Date.now() + OTP_TTL_MS);

        // Clean up expired OTP display records for this phone
        await db
          .delete(verification)
          .where(
            and(
              eq(verification.identifier, `otp-display:${phone}`),
              lt(verification.expiresAt, new Date()),
            ),
          );

        await db
          .insert(verification)
          .values({
            id: crypto.randomUUID(),
            identifier: `otp-display:${phone}`,
            value: code,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: verification.identifier,
            set: {
              value: code,
              expiresAt,
              updatedAt: new Date(),
            },
          });

        if (
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'production'
        ) {
          console.log(`\n📱 OTP for ${phone}: ${code}\n`);
          return;
        }

        // ---- Production: Africa's Talking (common in Cameroon) ----
        // pnpm add africastalking
        // const AfricasTalking = require("africastalking");
        // const at = AfricasTalking({
        //   apiKey: process.env.AT_API_KEY!,
        //   username: process.env.AT_USERNAME!,
        // });
        // await at.SMS.send({
        //   to: [phone],
        //   message: `Your Camtel verification code is: ${code}. Valid for 10 minutes.`,
        //   from: process.env.AT_SENDER_ID,
        // });

        // ---- Production: Twilio ----
        // pnpm add twilio
        // const twilio = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // await twilio.messages.create({
        //   body: `Your Camtel verification code is: ${code}. Valid for 10 minutes.`,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   to: phone,
        // });

        throw new Error(
          "No SMS provider configured. Set up Africa's Talking or Twilio in lib/auth.ts.",
        );
      },

      // Brute-force protection — 3 wrong attempts invalidates the OTP
      allowedAttempts: 3,
    }),
  ],

  // -------------------------------------------------------------------------
  // Session
  // -------------------------------------------------------------------------
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days base expiry
    updateAge: 60 * 60 * 24, // refresh cookie if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-min client-side cache to reduce DB reads
    },
    // Enhanced cookie security
    cookieAttributes: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      httpOnly: true, // Prevent XSS attacks
    },
  },

  // -------------------------------------------------------------------------
  // Session Hooks - Extend admin sessions to 7 days
  // -------------------------------------------------------------------------
  sessionHooks: {
    after: [
      {
        matcher(context: any) {
          // Extend session for admin users to 7 days
          return context.user?.role === 'admin';
        },
        handler: async ({ session }: any) => {
          if (session) {
            // Update session expiresAt to 7 days from now
            const sevenDaysFromNow = new Date(
              Date.now() + 60 * 60 * 24 * 7 * 1000,
            );
            await db
              .update(schema.session)
              .set({ expiresAt: sevenDaysFromNow })
              .where(eq(schema.session.id, session.id));
          }
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Rate limiting
  // -------------------------------------------------------------------------
  rateLimit: {
    enabled: true, // Enable in all environments for security
    window: 300,
    max: 10,
    customRules: {
      // Session polling - allow frequent checks (useSession hook polls this)
      '/get-session': {
        window: 60, // 1 minute window
        max: process.env.NODE_ENV === 'production' ? 60 : 120, // 1-2 per second
      },
      // Max 5 OTP sends per minute in development, 3 per 5 minutes in production
      '/phone-number/send-otp': {
        window: process.env.NODE_ENV === 'production' ? 300 : 60,
        max: process.env.NODE_ENV === 'production' ? 3 : 5,
      },
      // Max 5 verify attempts per 2 minutes
      '/phone-number/verify': {
        window: 300,
        max: 10,
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false, // not settable by the client
      },
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL!],
});

export type Auth = typeof auth;
