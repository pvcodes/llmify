import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return Response.json('ok');
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

export async function POST() {
  try {
    return Response.json('ok');
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
