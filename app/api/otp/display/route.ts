import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { getTranslations } from 'next-intl/server';

const querySchema = z.object({
  phone: z
    .string()
    .min(1)
    .regex(/^\+[1-9]\d{7,14}$/, 'Invalid phone number'),
});

// In-process rate limit — one IP gets max 10 reads per 10-min window.
// This is per-instance; if you run multiple replicas, back this with
// Redis or Postgres. For a single-instance deployment it's sufficient.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 10 * 60 * 1000; // 10 minutes
  const max = 10;

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return false;
  }

  if (entry.count >= max) return true;

  entry.count += 1;
  return false;
}

export async function GET(request: NextRequest) {
  // Get translations for error messages
  const t = await getTranslations('Auth');

  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: t('tooManyRequests') },
      { status: 429 },
    );
  }

  // Validate query param
  const parsed = querySchema.safeParse({
    phone: request.nextUrl.searchParams.get('phone'),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: t('invalidPhoneNumber') },
      { status: 400 },
    );
  }

  const { phone } = parsed.data;

  try {
    const record = await db.query.verification.findFirst({
      where: (v, { and, eq, gt }) =>
        and(
          eq(v.identifier, `otp-display:${phone}`),
          gt(v.expiresAt, new Date()),
        ),
      columns: {
        value: true,
        expiresAt: true,
      },
    });

    if (!record) {
      // Return 200 with null — don't leak whether the phone exists via status codes
      return NextResponse.json({ code: null });
    }

    return NextResponse.json({ code: record.value });
  } catch (err) {
    console.error('[GET /api/otp/display]', err);
    return NextResponse.json(
      { message: t('internalServerError') },
      { status: 500 },
    );
  }
}
