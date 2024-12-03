import { db } from '../_lib/prisma';
import { DataTable } from '../components/ui/data-table';
import { transactionColumns } from './_columns';
import Navbar from '../components/ui/navbar';
import AddTransactionButton from '../components/add-transaction-button';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ScrollArea } from '../components/ui/scroll-area';
import { canUserAddTransaction } from '../_data/can-user-add-transaction';

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  // acessaras transações do meubanco de dados
  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  // acessar as transasões
  return (
    // titulo e botão
    <>
      <Navbar />
      <main>
        <section className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between m-[2rem]">
            <div>
              <h1 className="text-2xl">Transações</h1>
            </div>
            <div>
              <AddTransactionButton
                userCanAddTransaction={userCanAddTransaction}
              />
            </div>
          </div>
          <ScrollArea className="mx-[2rem]">
            <DataTable columns={transactionColumns} data={transactions} />
          </ScrollArea>
        </section>
      </main>
    </>
  );
};

export default TransactionsPage;
