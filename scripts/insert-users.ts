#!/usr/bin/env node

/**
 * TypeScript version of the user insertion script
 * Usage: npx tsx scripts/insert-users.ts
 */

import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '../db/schema/auth-schema';

interface UserData {
  id?: string;
  name: string;
  email: string;
  email_verified?: boolean;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  service_id?: string | null;
  id_card_number?: string | null;
  location_plan?: string | null;
  photo_path?: string | null;
  must_change_password: boolean;
  password?: string; // Optional for existing users
  role?: 'admin' | 'user'; // Optional, defaults to 'user'
}

// Sample user data matching your format
const sampleUsers: UserData[] = [
  {
    id: 'J9zrRb7wflUiZdZnEe9WLRznZIEDFRe5',
    name: 'User 9969',
    email: '237620779969@phone.camtel.local',
    email_verified: false,
    image: null,
    created_at: '2026-03-14 02:12:11.72',
    updated_at: '2026-03-14 02:12:11.72',
    phone_number: '+237620779969',
    phone_number_verified: true,
    service_id: null,
    id_card_number: null,
    location_plan: null,
    photo_path: null,
    must_change_password: true,
    password: 'password123',
  },
  {
    id: 'J9zrRb7wflUiZdZnEe9WLRznZIEEcxe5',
    name: 'User 7769',
    email: '237620997769@phone.camtel.local',
    email_verified: false,
    image: null,
    created_at: '2026-03-03 22:02:21.035',
    updated_at: '2026-03-03 22:02:21.035',
    phone_number: '+237620997769',
    phone_number_verified: true,
    service_id: null,
    id_card_number: null,
    location_plan: null,
    photo_path: null,
    must_change_password: true,
    password: 'password123',
  },
  {
    id: 'KlqMLGoB80Pa7DaoyauWTAhl8R0rqxE2',
    name: 'Kum Jude T. Tem',
    email: 'judekum14@gmail.com',
    email_verified: false,
    image: null,
    created_at: '2026-02-28 04:37:03.008',
    updated_at: '2026-03-01 03:33:44.22',
    phone_number: '+237620779967',
    phone_number_verified: true,
    service_id: '620779967',
    id_card_number: null,
    location_plan: null,
    photo_path: null,
    must_change_password: true,
    password: 'password123',
  },
  {
    id: 'pUGzdoTZ2cPlefmwuqScb5b05AnzH4eQ',
    name: 'User 7455',
    email: '237675827455@phone.camtel.local',
    email_verified: false,
    image: null,
    created_at: '2026-03-03 01:34:15.795',
    updated_at: '2026-03-11 22:41:35.326',
    phone_number: '+237675827455',
    phone_number_verified: true,
    service_id: null,
    id_card_number: null,
    location_plan: null,
    photo_path: null,
    must_change_password: true,
    password: 'password123',
  },
  {
    id: 'yN7lvnWdWsOG5eLSQv0OZFc747AHNOdT',
    name: 'Jean Pierre',
    email: 'jean@example.com',
    email_verified: false,
    image: null,
    created_at: '2026-02-28 12:55:09.235',
    updated_at: '2026-02-28 13:02:26.89',
    phone_number: '+237620105050',
    phone_number_verified: true,
    service_id: '620105050',
    id_card_number: null,
    location_plan: null,
    photo_path: null,
    must_change_password: true,
    password: 'password123',
  },
];

async function insertUsers(users: UserData[] = sampleUsers): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
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

    for (const userData of users) {
      const {
        password,
        id: providedId,
        phone_number,
        phone_number_verified,
        service_id,
        id_card_number,
        location_plan,
        photo_path,
        email_verified,
        created_at,
        updated_at,
        role = 'user',
        ...rest
      } = userData;

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

      // Hash password if provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      } else {
        // Generate a random password if none provided
        hashedPassword = await bcrypt.hash('password123', 10);
      }

      // Create user
      const userId = providedId || uuidv4();
      const now = updated_at ? new Date(updated_at) : new Date();
      const createdAt = created_at ? new Date(created_at) : now;

      const newUser = await db
        .insert(schema.user)
        .values({
          id: userId,
          name: userData.name,
          email: userData.email,
          emailVerified: email_verified || false,
          image: userData.image,
          createdAt: createdAt,
          updatedAt: now,
          phoneNumber: phone_number,
          phoneNumberVerified: phone_number_verified || false,
          serviceId: service_id,
          idCardNumber: id_card_number,
          locationPlan: location_plan,
          photoPath: photo_path,
          role: role,
          mustChangePassword: userData.must_change_password,
        })
        .returning();

      // Create account with password
      await db.insert(schema.account).values({
        id: uuidv4(),
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: createdAt,
        updatedAt: now,
      });

      // Add phone number if provided
      if (phone_number) {
        await db.insert(schema.userPhoneNumbers).values({
          id: uuidv4(),
          userId: userId,
          phoneNumber: phone_number,
          isPrimary: true,
          createdAt: createdAt,
        });
      }

      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n✅ User insertion completed successfully!');
  } finally {
    await pgPool.end();
  }
}

// Command line interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx tsx scripts/insert-users.ts [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be inserted without actually inserting
  --count N      Insert N random test users
  --admin        Create admin user only

Environment variables:
  DATABASE_URL   PostgreSQL connection string (required)

Examples:
  npx tsx scripts/insert-users.ts
  npx tsx scripts/insert-users.ts --dry-run
  npx tsx scripts/insert-users.ts --count 5
  npx tsx scripts/insert-users.ts --admin
    `);
    return;
  }

  if (args.includes('--dry-run')) {
    console.log('🔍 Dry run mode - showing what would be inserted:');
    console.log(JSON.stringify(sampleUsers, null, 2));
    return;
  }

  let usersToInsert = sampleUsers;

  // Handle --count option
  const countIndex = args.findIndex((arg) => arg === '--count');
  if (countIndex !== -1 && args[countIndex + 1]) {
    const count = parseInt(args[countIndex + 1]);
    if (!isNaN(count) && count > 0) {
      usersToInsert = generateRandomUsers(count);
      console.log(`Generating ${count} random test users...`);
    }
  }

  // Handle --admin option
  if (args.includes('--admin')) {
    usersToInsert = sampleUsers.filter((u) => u.role === 'admin');
    if (usersToInsert.length === 0) {
      // If no admin users in sample data, create one
      usersToInsert = [
        {
          name: 'Admin User',
          email: 'admin@camtel.cm',
          email_verified: false,
          image: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          phone_number: '+237620000001',
          phone_number_verified: true,
          service_id: '620000001',
          id_card_number: null,
          location_plan: null,
          photo_path: null,
          must_change_password: false,
          password: 'admin123',
          role: 'admin',
        },
      ];
    }
    console.log('Creating admin user only...');
  }

  await insertUsers(usersToInsert);
}

// Generate random test users
function generateRandomUsers(count: number): UserData[] {
  const users: UserData[] = [];
  const roles: ('admin' | 'user')[] = ['user', 'user', 'user', 'admin']; // 75% users, 25% admins

  for (let i = 1; i <= count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const phoneNumber = `+237${String(Math.floor(Math.random() * 900000000) + 100000000)}`;
    const serviceId =
      Math.random() > 0.5
        ? String(Math.floor(Math.random() * 900000000) + 100000000)
        : null;

    users.push({
      name: `User ${i}`,
      email: `testuser${i}@camtel.cm`,
      email_verified: false,
      image: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone_number: phoneNumber,
      phone_number_verified: true,
      service_id: serviceId,
      id_card_number: null,
      location_plan: null,
      photo_path: null,
      must_change_password: true,
      password: 'password123',
      role: role,
    });
  }

  return users;
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { insertUsers, sampleUsers, generateRandomUsers };
export type { UserData };
