import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, account, userPhoneNumbers } from '@/db/schema/auth-schema';
import { hash } from 'bcryptjs';
import { adminCreateUserSchema } from '@/lib/validations/auth';
import { inArray } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();

    // Extract and parse phone numbers correctly with proper error handling
    const phoneNumbersRaw = formData.get('phoneNumbers');
    let parsedPhoneNumbers: unknown;

    if (!phoneNumbersRaw || typeof phoneNumbersRaw !== 'string') {
      return NextResponse.json(
        { message: 'Phone numbers are required' },
        { status: 400 },
      );
    }

    try {
      parsedPhoneNumbers = JSON.parse(phoneNumbersRaw);
    } catch {
      return NextResponse.json(
        { message: 'Invalid phoneNumbers format' },
        { status: 400 },
      );
    }

    // Validate it's an array of strings
    if (
      !Array.isArray(parsedPhoneNumbers) ||
      !parsedPhoneNumbers.every((item) => typeof item === 'string')
    ) {
      return NextResponse.json(
        { message: 'Phone numbers must be an array of strings' },
        { status: 400 },
      );
    }

    const validationResult = adminCreateUserSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      idCardNumber: formData.get('idCardNumber'),
      locationPlan: formData.get('locationPlan'),
      phoneNumbers: parsedPhoneNumbers, // Now matches z.array(z.string())
      photo: formData.get('photo') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // FIX #2 & #3: Check phone uniqueness across both tables with single query
    const duplicatePhones = await db
      .select({ phoneNumber: user.phoneNumber })
      .from(user)
      .where(inArray(user.phoneNumber, validatedData.phoneNumbers))
      .union(
        db
          .select({ phoneNumber: userPhoneNumbers.phoneNumber })
          .from(userPhoneNumbers)
          .where(
            inArray(userPhoneNumbers.phoneNumber, validatedData.phoneNumbers),
          ),
      );

    if (duplicatePhones.length > 0) {
      return NextResponse.json(
        {
          message: 'Phone number(s) already in use',
          conflicts: duplicatePhones.map((r) => r.phoneNumber),
        },
        { status: 409 },
      );
    }

    // DATABASE OPERATIONS
    const userId = crypto.randomUUID();
    const DEFAULT_PASSWORD = 'camteluser';
    const hashedPassword = await hash(DEFAULT_PASSWORD, 10);

    // FIX #8: Handle photo upload properly
    let photoPath: string | null = null;
    const photoFile = formData.get('photo') as File;

    if (photoFile && photoFile.size > 0) {
      // TODO: Implement actual file storage (S3, local storage, etc.)
      // For now, fail fast if photo upload is not properly implemented
      return NextResponse.json(
        { message: 'Photo upload not yet implemented' },
        { status: 501 },
      );
      // When implemented:
      // photoPath = await uploadToStorage(photoFile, userId);
    }

    await db.transaction(async (tx) => {
      // 1. Insert User (without plaintext password)
      await tx.insert(user).values({
        id: userId,
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        role: validatedData.role,
        phoneNumber: validatedData.phoneNumbers[0],
        serviceId: validatedData.phoneNumbers[0],
        idCardNumber: validatedData.idCardNumber,
        locationPlan: validatedData.locationPlan,
        photoPath: photoPath,
        mustChangePassword: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 2. Insert Multiple Phone Numbers (batch operation)
      const phoneInserts = validatedData.phoneNumbers.map((phone, index) => ({
        id: crypto.randomUUID(),
        userId,
        phoneNumber: phone,
        isPrimary: index === 0,
        createdAt: new Date(),
      }));
      await tx.insert(userPhoneNumbers).values(phoneInserts);

      // 3. Create Auth Account
      await tx.insert(account).values({
        id: crypto.randomUUID(),
        userId,
        accountId: userId,
        providerId: 'credential',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // FIX #6: Log without PII
    console.log('User created successfully', {
      userId,
      adminEmail: session.user.email,
      role: validatedData.role,
    });

    return NextResponse.json(
      {
        message: 'User created',
        userId,
      },
      { status: 201 },
    );
  } catch (error) {
    // FIX #6: Don't log PII in production
    console.error(
      'Error creating user:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
