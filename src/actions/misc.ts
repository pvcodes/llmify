'use server';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/(auth)/auth';
import db from '@/db';

export const submitQuery = async ({ message, subject }: { message: string; subject: string }) => {
  try {
    const user = await getAuthenticatedUser();

    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    await db.supportQuery.create({
      data: {
        message,
        subject,
        user: {
          connect: {
            email: user.email,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting query:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserTierDetails = async (email: string) => {
  const tier = await db.user.findFirst({
    where: { email },
    include: { billing: true },
  });
  return tier?.billing;
};

export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const getAuthenticatedUser = async (redirectUrl: string = '/signin') => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return redirect(redirectUrl);
  }
  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return redirect(redirectUrl);
  }

  return user;
};
