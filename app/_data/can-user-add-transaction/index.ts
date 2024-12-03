import { auth, clerkClient } from '@clerk/nextjs/server';
import { getCurrentMonthTransactions } from '../get-month-current-transaction';

export const canUserAddTransaction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const user = (await clerkClient()).users.getUser(userId);
  if ((await user).publicMetadata.subscriptionPlan === 'Premium') {
    return true;
  }
  const currentMonthTRansactions = await getCurrentMonthTransactions();

  if (currentMonthTRansactions >= 10) {
    return false;
  }
  return true;
};
