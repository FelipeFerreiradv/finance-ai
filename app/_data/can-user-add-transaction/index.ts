import { auth, clerkClient } from '@clerk/nextjs/server';
import { getCurrentMonthTransactions } from '../get-month-current-transaction';

export const canUserAddTransaction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (user.publicMetadata?.subscriptionPlan === 'premium') {
    return true;
  }

  const currentMonthTransactions = await getCurrentMonthTransactions();
  if (currentMonthTransactions >= 10) {
    return false;
  }
  return true;
};
