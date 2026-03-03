import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema/auth-schema';

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pgPool, { schema });
