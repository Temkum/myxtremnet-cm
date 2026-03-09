/**
 * app/api/user/profile/route.ts
 *
 * PATCH /api/user/profile
 *
 * Called immediately after phone OTP verification during registration to
 * store the extra fields (name, email, serviceId) that Better Auth's
 * phoneNumber plugin doesn't accept at signup time.
 *
 * Protected: requires an active session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/db/schema/auth-schema';
import { eq } from 'drizzle-orm';

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(1),
});

function deriveServiceIdFromPhoneNumber(phoneNumber: string) {
  // Expect E.164 Cameroon number, e.g. +237650000000
  // Business rule: serviceId is the local 9-digit number (without +237)
  const normalized = phoneNumber.trim();
  const local = normalized.startsWith('+237')
    ? normalized.slice(4)
    : normalized.startsWith('237')
      ? normalized.slice(3)
      : normalized;

  if (!/^\d{9}$/.test(local)) return null;
  return local;
}

export async function PATCH(request: NextRequest) {
  // Validate session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const result = profileSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: 'Validation failed', errors: result.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, phoneNumber } = result.data;
  const serviceId = deriveServiceIdFromPhoneNumber(phoneNumber);

  if (!serviceId) {
    return NextResponse.json(
      { message: 'Invalid phone number for service ID derivation' },
      { status: 422 },
    );
  }

  try {
    // Check serviceId is not already taken by another user
    const existing = await db.query.user.findFirst({
      where: (u, { and, eq, ne }) =>
        and(eq(u.serviceId, serviceId), ne(u.id, session.user.id)),
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Service ID is already registered' },
        { status: 409 },
      );
    }

    const updateData: Partial<typeof user.$inferInsert> = {
      name,
      serviceId,
      updatedAt: new Date(),
    };

    if (typeof email === 'string' && email.length > 0) {
      updateData.email = email;
    }

    updateData.phoneNumber = phoneNumber;

    await db.update(user).set(updateData).where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/user/profile]', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
