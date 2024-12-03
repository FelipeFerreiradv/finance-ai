'use server';

import { db } from '@/app/_lib/prisma';
import { DeteleTransactionSchema } from './schema';
import { revalidatePath } from 'next/cache';

export const deteleTransaction = async ({
  transactionId,
}: DeteleTransactionSchema) => {
  await db.transaction.delete({
    where: {
      id: transactionId,
    },
  });
  revalidatePath('/transactions');
  revalidatePath('/dashboard');
};
