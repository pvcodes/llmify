'use server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/(auth)/auth';
import db from '@/db';

export const submitQuery = async ({ message, subject }: { message: string; subject: string }) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }

    await db.supportQuery.create({
      data: {
        message,
        subject,
        user: {
          connect: {
            email: session.user.email,
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
