/**
 * Better Auth schema for PostgreSQL + Drizzle
 *
 * After any change to this file run:
 *   pnpm drizzle-kit generate   -> creates a migration file
 *   pnpm drizzle-kit migrate    -> applies it to the DB
 *
 * Never use `drizzle-kit push` in production.
 */

import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// user
// ---------------------------------------------------------------------------
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),

  // phoneNumber plugin adds these fields
  phoneNumber: text('phone_number').unique(),
  phoneNumberVerified: boolean('phone_number_verified').default(false),

  // your business field — Camtel service ID
  serviceId: text('service_id').unique(),

  // user role for admin access control
  role: text('role').notNull().default('user'),
});

// ---------------------------------------------------------------------------
// session
// ---------------------------------------------------------------------------
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

// ---------------------------------------------------------------------------
// account  (OAuth + credential accounts)
// ---------------------------------------------------------------------------
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// ---------------------------------------------------------------------------
// verification  (OTP + email tokens)
// ---------------------------------------------------------------------------
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull().unique(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// ---------------------------------------------------------------------------
// Relations (required for Drizzle joins in Better Auth >= 1.4)
// ---------------------------------------------------------------------------
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));
