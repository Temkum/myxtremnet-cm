import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, account, userPhoneNumbers } from '@/db/schema/auth-schema';
import { hash } from 'bcryptjs';
import { adminCreateUserSchema } from '@/lib/validations/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();

    // Extract and parse phone numbers correctly
    const phoneNumbersRaw = formData.get('phoneNumbers');
    let parsedPhoneNumbers = [];

    try {
      const json = JSON.parse(phoneNumbersRaw as string);
      // React Hook Form sends an array of objects: [{id: '...', number: '620...'}]
      // Zod expects an array of strings: ['620...']
      parsedPhoneNumbers = json.map((p: { number: string }) => p.number);
    } catch (e) {
      return NextResponse.json(
        { message: 'Invalid phone number format' },
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

    // DATABASE OPERATIONS
    const userId = crypto.randomUUID();
    const DEFAULT_PASSWORD = 'camteluser';
    const hashedPassword = await hash(DEFAULT_PASSWORD, 10);

    await db.transaction(async (tx) => {
      // 1. Insert User
      await tx.insert(user).values({
        id: userId,
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        role: validatedData.role,
        phoneNumber: validatedData.phoneNumbers[0],
        idCardNumber: validatedData.idCardNumber,
        locationPlan: validatedData.locationPlan,
        defaultPassword: DEFAULT_PASSWORD,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 2. Insert Multiple Phone Numbers
      for (let i = 0; i < validatedData.phoneNumbers.length; i++) {
        await tx.insert(userPhoneNumbers).values({
          id: crypto.randomUUID(),
          userId,
          phoneNumber: validatedData.phoneNumbers[i],
          isPrimary: i === 0,
          createdAt: new Date(),
        });
      }

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

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
