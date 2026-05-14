/**
 * Database client — single source of truth.
 *
 * Re-exports the Drizzle client from db/schema/index.ts so that all imports
 * across the app use the same connection pool.
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *
 * The underlying driver is `postgres.js` (compatible with node-postgres).
 * It works with PostgreSQL, Neon, Supabase, and any Postgres-compatible DB.
 *
 * To switch to a different database (MySQL, SQLite, etc.):
 *   1. Install the appropriate Drizzle driver (e.g., drizzle-orm/mysql2)
 *   2. Update db/schema/index.ts with the new driver
 *   3. Everything else stays the same
 */

export { db } from '@/db/schema';
