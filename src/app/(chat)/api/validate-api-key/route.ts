import { NextResponse } from 'next/server';

import { validateProviderAPIKey } from '@/lib/ai';

import { payloadSchema, type PayloadType } from './schema';

import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const payload: PayloadType = await req.json().catch(() => ({}));
  const parseResult = payloadSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: parseResult.error.message,
      },
      { status: 400 }
    );
  }
  const { provider, apiKey } = parseResult.data;

  try {
    const isValid = await validateProviderAPIKey(provider, apiKey);
    return NextResponse.json({
      success: true,
      valid: isValid,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            (error as Error)?.message ||
            (typeof error === 'string' ? error : null) ||
            'Something went wrong',
        },
      },
      { status: 400 }
    );
  }
}
