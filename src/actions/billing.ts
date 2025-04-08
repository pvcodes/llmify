'use server';
import db from '@/db';

export const getUserBilling = async (userId: number) => {
  return db.billing.findUnique({
    where: { userId },
  });
};
