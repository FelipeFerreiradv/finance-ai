import SummaryCards from './summary-cards';
import { PiggyBankIcon, TrendingDown, TrendingUp } from 'lucide-react';
import PieChartTransaction from './pie-chart';
import { getDashBoard } from '@/app/_data/get-dashboard'; // Importando o método getDashBoard
import { db } from '@/app/_lib/prisma';
import { TransactionPercentagePerType } from '@/app/_data/get-dashboard/type';
import ExpensesPerCategory from './expenses-per-category';
import SummaryCardLarge from './summary-card-large';

interface SummaryCards {
  month: string;
  typesPorcentenge?: TransactionPercentagePerType;
  userCanAddTransaction?: boolean;
}

const SummaryCard = async ({ month, userCanAddTransaction }: SummaryCards) => {
  // Obter os dados do dashboard utilizando o mês
  const dashboard = await getDashBoard(month);

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

  return (
    <div className="flex flex-col gap-8 w-[150%] mx-[2rem]">
      <div className="flex flex-col gap-2">
        <SummaryCardLarge
          month={month}
          userCanAddTransaction={userCanAddTransaction}
        />
        <div className="flex items-center gap-6 w-full my-6">
          <SummaryCards
            icon={<PiggyBankIcon />}
            title="Investido"
            amount={investimentTotal}
            size="large"
            bg="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#202020]"
          />
          <SummaryCards
            icon={<TrendingUp className="text-[#55B02E]" />}
            title="Receita"
            amount={depositTotal}
            size="small"
            bg="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#55B02E14]"
          />
          <SummaryCards
            icon={<TrendingDown className="text-red-500" />}
            title="Despeza"
            amount={expenseTotal}
            size="small"
            bg="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#F6352E14]"
          />
        </div>
        <div className="flex gap-8">
          <PieChartTransaction {...dashboard} />{' '}
          <ExpensesPerCategory
            expensePerCategory={dashboard.totalExpensePerCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
