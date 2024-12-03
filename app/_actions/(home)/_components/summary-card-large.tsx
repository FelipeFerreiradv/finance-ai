import { db } from '@/app/_lib/prisma';
import AddTransactionButton from '@/app/components/add-transaction-button';
import { Eye, Wallet } from 'lucide-react';

interface SummaryCards {
  month: string;
  userCanAddTransaction?: boolean;
}

const SummaryCardLarge = async ({
  month,
  userCanAddTransaction,
}: SummaryCards) => {
  // Obter os dados do dashboard utilizando o mês
  const where = {
    date: {
      gte: new Date(`2024-${month}-01`),
      lt: new Date(`2024-${month}-31`),
    },
  };

  const depositTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'DEPOSITE' },
        _sum: { amount: true },
      })
    )?._sum?.amount // 0;
  );
  const expenseTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      })
    )?._sum?.amount // 0;
  );
  const investimentTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'INVESTIMENT' },
        _sum: { amount: true },
      })
    )?._sum?.amount // 0;
  );
  const balance = depositTotal - expenseTotal - investimentTotal;

  // const userCanAddTransaction = await canUserAddTransaction();

  return (
    <div className="relative flex justify-between w-full h-[160px] px-[2rem] py-[2.5rem] rounded-[20px] border bg-[#FFFFFF14]">
      <div className="flex flex-col justify-between gap-[1rem]">
        <div className="flex items-center gap-[.5rem]">
          <div className="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#0F0E11]">
            <Wallet width={16} />
          </div>
          <p className="font-normal text-[#ffffffb7]">Saldo</p>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-[36px]">R${balance}</h2>
          <Eye width={24} />
        </div>
      </div>
      <div className="absolute bottom-[2.5rem] right-[2rem]">
        <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
      </div>
    </div>
  );
};

export default SummaryCardLarge;
