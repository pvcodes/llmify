import { NextResponse } from 'next/server';

export async function POST() {
  try {
    Response.json('ok');
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
