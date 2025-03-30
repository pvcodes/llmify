import db from '@/db';

export const getRecentChat = async (userEmail: string) => {
  return db.chat.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    take: 3, // Limit to 3 results
    orderBy: {
      createdAt: 'desc', // Sort by newest first
    },
    include: {
      messages: {
        where: {
          role: 'user',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          content: true,
          createdAt: true,
        },
      },
    },
  });
};
