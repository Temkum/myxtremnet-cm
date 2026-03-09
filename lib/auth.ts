/**
 * Phone number is the primary login identifier.
 * Email is collected at registration for account recovery only.
 *
 * OTP flow:
 *   1. Client calls authClient.phoneNumber.sendOtp({ phoneNumber })
 *   2. sendOTP callback fires → you forward the code via SMS provider
 *   3. Client calls authClient.phoneNumber.verify({ phoneNumber, code })
 *   4. Better Auth creates/resumes session
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { db } from '@/lib/db';
import * as schema from '@/db/schema/auth-schema';

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
      // In dev: code is logged to the console — no SMS needed.
      // In prod: plug in Twilio, Africa's Talking, or any other SMS provider.
      sendOTP: async ({ phoneNumber: phone, code }, _request) => {
        if (process.env.NODE_ENV === 'development') {
          // Visible in your terminal during local dev
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
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh cookie if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-min client-side cache to reduce DB reads
    },
  },

  // -------------------------------------------------------------------------
  // Rate limiting
  // -------------------------------------------------------------------------
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
    customRules: {
      // Max 1 OTP send per 5 minutes per IP
      '/phone-number/send-otp': {
        window: 300,
        max: 1,
      },
      // Max 5 verify attempts per minute
      '/phone-number/verify': {
        window: 60,
        max: 5,
      },
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL!],
});

export type Auth = typeof auth;
