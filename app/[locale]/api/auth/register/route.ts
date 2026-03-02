import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  void req;
  return NextResponse.json(
    {
      message:
        'This endpoint has been replaced by Better Auth. Use /api/auth/[...all].',
    },
    { status: 410 },
  );
}
