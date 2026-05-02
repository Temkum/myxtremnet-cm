#!/usr/bin/env node

/**
 * Script to insert users into the database
 * Usage: node scripts/insert-users.js
 *
 * Environment variables required:
 * - DATABASE_URL: PostgreSQL connection string
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '../db/schema/auth-schema.js';

// Sample user data - modify as needed
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@camtel.cm',
    role: 'admin',
    serviceId: 'CAM001',
    idCardNumber: 'ID123456789',
    locationPlan: 'Plan_A',
    mustChangePassword: false,
    password: 'admin123', // Will be hashed
  },
  {
    name: 'John Doe',
    email: 'john.doe@camtel.cm',
    role: 'user',
    serviceId: 'CAM002',
    idCardNumber: 'ID987654321',
    locationPlan: 'Plan_B',
    mustChangePassword: true,
    password: 'user123', // Will be hashed
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@camtel.cm',
    role: 'user',
    serviceId: 'CAM003',
    idCardNumber: 'ID456789123',
    locationPlan: 'Plan_C',
    mustChangePassword: true,
    password: 'user123', // Will be hashed
  },
];

async function insertUsers() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
  });

  const db = drizzle(pgPool, { schema });

  try {
    console.log('Starting user insertion...');

    for (const userData of sampleUsers) {
      const { password, ...userFields } = userData;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, userData.email))
        .limit(1);

      if (existingUser.length > 0) {
        console.log(
          `User with email ${userData.email} already exists, skipping...`,
        );
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = uuidv4();
      const now = new Date();

      const newUser = await db
        .insert(schema.user)
        .values({
          id: userId,
          ...userFields,
          createdAt: now,
          updatedAt: now,
          emailVerified: false,
          phoneNumberVerified: false,
        })
        .returning();

      // Create account with password
      await db.insert(schema.account).values({
        id: uuidv4(),
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });

      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n✅ User insertion completed successfully!');
  } catch (error) {
    console.error('❌ Error inserting users:', error);
    process.exit(1);
  } finally {
    await pgPool.end();
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node scripts/insert-users.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be inserted without actually inserting
  --custom       Use custom user data (edit the script to modify)

Environment variables:
  DATABASE_URL   PostgreSQL connection string (required)

Examples:
  node scripts/insert-users.js
  node scripts/insert-users.js --dry-run
    `);
    return;
  }

  if (args.includes('--dry-run')) {
    console.log('🔍 Dry run mode - showing what would be inserted:');
    console.log(JSON.stringify(sampleUsers, null, 2));
    return;
  }

  await insertUsers();
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { insertUsers, sampleUsers };
