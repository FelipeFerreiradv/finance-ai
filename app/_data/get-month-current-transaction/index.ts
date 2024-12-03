import { db } from '@/app/_lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { endOfMonth, startOfMonth } from 'date-fns';
import { redirect } from 'next/navigation';

export const getCurrentMonthTransactions = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  return db.transaction.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth(new Date()),
        lt: endOfMonth(new Date()),
      },
    },
  });
};
