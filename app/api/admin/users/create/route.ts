import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, account, userPhoneNumbers } from '@/db/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { adminCreateUserSchema } from '@/lib/validations/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const phoneNumbersJson = formData.get('phoneNumbers') as string;
    const idCardNumber = formData.get('idCardNumber') as string;
    const locationPlan = formData.get('locationPlan') as string;
    const photo = formData.get('photo') as File | null;

    // Validate input using Zod schema
    const validationResult = adminCreateUserSchema.safeParse({
      name,
      email,
      role,
      phoneNumbers: JSON.parse(phoneNumbersJson || '[]'),
      idCardNumber,
      locationPlan,
      photo: photo || undefined,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message);
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 },
      );
    }

    // Check if any phone number already exists
    for (const phoneNumber of validatedData.phoneNumbers) {
      const existingPhone = await db
        .select()
        .from(user)
        .where(eq(user.phoneNumber, phoneNumber))
        .limit(1);

      if (existingPhone.length > 0) {
        return NextResponse.json(
          { message: `Phone number ${phoneNumber} already exists` },
          { status: 409 },
        );
      }
    }

    // Generate default password and hash it
    const defaultPassword = 'camteluser';
    const hashedPassword = await hash(defaultPassword, 10);

    // Handle photo upload if present
    let photoPath: string | null = null;
    if (validatedData.photo && validatedData.photo.size > 0) {
      // In a real implementation, you would upload to a storage service
      // For now, we'll just store that a photo was provided
      photoPath = 'uploaded';
    }

    // Create user with primary phone number
    const userId = crypto.randomUUID();
    const now = new Date();

    // Create user record
    await db.insert(user).values({
      id: userId,
      name: validatedData.name.trim(),
      email: validatedData.email.trim().toLowerCase(),
      role: validatedData.role === 'admin' ? 'admin' : 'user',
      phoneNumber: validatedData.phoneNumbers[0], // Primary phone number
      phoneNumberVerified: true, // Admin-created users are pre-verified
      emailVerified: false,
      idCardNumber: validatedData.idCardNumber.trim(),
      locationPlan: validatedData.locationPlan.trim(),
      photoPath,
      defaultPassword, // Store for admin reference
      createdAt: now,
      updatedAt: now,
    });

    // Create phone number records
    for (let i = 0; i < validatedData.phoneNumbers.length; i++) {
      await db.insert(userPhoneNumbers).values({
        id: crypto.randomUUID(),
        userId,
        phoneNumber: validatedData.phoneNumbers[i],
        isPrimary: i === 0, // First phone number is primary
        createdAt: now,
      });
    }

    // Create account record with hashed password for Better Auth
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: 'credential', // Better Auth uses 'credential' for email/password
      userId: userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    // Log the creation for audit purposes
    console.log(`User created by admin ${session.user.email}:`, {
      userId,
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      phoneNumbers: validatedData.phoneNumbers,
      idCardNumber: validatedData.idCardNumber,
      hasPhoto: !!photoPath,
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: userId,
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        phoneNumber: validatedData.phoneNumbers[0],
        phoneNumbers: validatedData.phoneNumbers,
        defaultPassword, // Return for admin to communicate to user
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
