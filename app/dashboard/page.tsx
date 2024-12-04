import Navbar from '../components/ui/navbar';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SummaryCard from '../_actions/(home)/_components/summary-card';
import TimeSelect from '../_actions/(home)/_components/time-select';
import { isMatch } from 'date-fns';
import LastTransactions from '../_actions/(home)/_components/last-transactions';
import { getDashBoard } from '../_data/get-dashboard';
import { canUserAddTransaction } from '../_data/can-user-add-transaction';
import ReportAiButton from '../_actions/(home)/_components/ai-report-button';

export interface PageProps {
  searchParams: Promise<{ month: string }>;
}

const DashboardPage = async ({ searchParams }: PageProps) => {
  // Aguarde a resolução da Promise de searchParams
  const { month } = await searchParams; // Espera o valor de month ser resolvido

  const dashboard = await getDashBoard(month);

  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const monthIsInvalid = !month || !isMatch(month, 'MM');
  if (monthIsInvalid) {
    redirect(`/dashboard/?month=${new Date().getMonth() + 1}`);
  }

  const userCanAddTransaction = await canUserAddTransaction();
  const user = (await clerkClient()).users.getUser(userId);

  return (
    <>
      <Navbar />
      <section className="flex items-center justify-between mx-[1.5rem] my-[2rem] overflow-hidden max-lg:flex-wrap max-lg:gap-4">
        <h1 className="font-bold text-[24px]">Dashboard</h1>
        <div className="flex items-center gap-[1.5rem]">
          <ReportAiButton
            month={month}
            hasPremiumPlan={
              (await user).publicMetadata.subscriptionPlan === 'premium'
            }
          />
          <TimeSelect />
        </div>
      </section>
      <section className="flex gap-4 w-full max-lg:flex-col overflow-hidden">
        <SummaryCard
          month={month}
          userCanAddTransaction={userCanAddTransaction}
        />
        <LastTransactions lastTransactions={dashboard.lastTransactions} />
      </section>
    </>
  );
};

export default DashboardPage;
