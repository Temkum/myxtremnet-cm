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
  email: z.string().email(),
  serviceId: z.string().min(9).max(20).regex(/^\d+$/),
});

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

  const { name, email, serviceId } = result.data;

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

    await db
      .update(user)
      .set({
        name,
        email,
        serviceId,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/user/profile]', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
