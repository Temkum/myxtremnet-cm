import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message:
        'This endpoint has been replaced by Better Auth. Use /api/auth/[...all].',
    },
    { status: 410 },
  );
}
