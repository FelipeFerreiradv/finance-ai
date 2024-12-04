import { TotalExpensesPerCategory } from '@/app/_data/get-dashboard/type';
import { formatCurrency } from '@/app/_untils/currenc';
import { Progress } from '@/app/components/ui/progress';
import { ScrollArea } from '@/app/components/ui/scroll-area';

export const TRANSACTION_CATEGORY_LABELS = {
  SALARY: 'Salário',
  HEALTH: 'Saude',
  HOUSING: 'Habitação',
  TRANSPORTATION: 'Transporte',
  FOOD: 'Comida',
  EDUCATION: 'Educação',
  ENTERTAINMENT: 'Entretenimento',
  UTILITY: 'Utilidade',
  OTHER: 'Outros',
};

interface TransactionsPercentChartProps {
  expensePerCategory: TotalExpensesPerCategory[];
}

const ExpensesPerCategory = ({
  expensePerCategory,
}: TransactionsPercentChartProps) => {
  return (
    <ScrollArea className="h-[550px] w-full rounded-[20px] border p-4">
      <div className="flex flex-col m-4 gap-6">
        <h1 className="font-bold text-[18px]">Gastos por categoria</h1>
        <div className="w-full h-[.1px] border bg-[#FFFFFF14]"></div>
      </div>
      {expensePerCategory.map((category) => (
        <section key={category.category} className="flex flex-col m-4 gap-8">
          <div className="flex flex-col gap-2 my-2">
            <div className="flex justify-between w-full">
              <h3 className="font-bold text-[14px]">
                {TRANSACTION_CATEGORY_LABELS[category.category]}
              </h3>
              <p className="font-large text-[14px]">
                {category.percentageOfTotal}%
              </p>
            </div>
            <div>
              <Progress value={category.percentageOfTotal} />
            </div>
            <div className="font-large text-[14px] text-[#ffffffa0]">
              <p> {formatCurrency(Number(category.totalAmount))}</p>
            </div>
          </div>
        </section>
      ))}
    </ScrollArea>
  );
};

export default ExpensesPerCategory;
