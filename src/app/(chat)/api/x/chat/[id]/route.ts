import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/(auth)/auth';
import db from '@/db';

import type { Message } from 'ai';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('unauthorized access');
    const { user } = session;

    const id = (await params).id;
    if (!id) throw new Error('not enough parameters');

    const name = req.nextUrl.searchParams.get('name') ?? false;

    if (name === 'true') {
      const chat = await db.chat.findUniqueOrThrow({
        where: { id, user: { email: user.email } },
      });
      return NextResponse.json(chat);
    }

    const message = await db.message.findMany({
      where: {
        chat: {
          id,
          user: {
            email: user.email,
          },
        },
      },
    });

    return NextResponse.json(message);
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get authenticated session
    const chatId = (await params).id;
    // const { user } = (await getServerSession(authOptions)) as Session;
    const { messages }: { messages: Message[] } = await req.json();
    const filteredMessage = messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      chatId,
    }));

    await db.message.createMany({
      data: filteredMessage,
    });

    return NextResponse.json({ success: true });
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('unauthorized access');
    const { user } = session;

    const chatId = (await params).id;
    if (!chatId) throw new Error('not enough parameters');

    const payload: { name: string } = await req.json().catch(() => {});
    if (!payload.name) throw new Error('not enough parameters');

    await db.chat.update({
      where: {
        id: chatId,
        user: {
          email: user?.email as string,
        },
      },
      data: { name: payload.name },
    });

    return NextResponse.json({ success: true });
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
