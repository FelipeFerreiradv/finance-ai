'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/ui/chart';
import { PiggyBankIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { TransactionType } from '@prisma/client';
import { TransactionPercentagePerType } from '@/app/_data/get-dashboard/type';
const chartConfig = {
  [TransactionType.DEPOSITE]: {
    label: 'Ganho',
    color: '#ffffff',
  },
  [TransactionType.EXPENSE]: {
    label: 'Gasto',
    color: '#55B02E',
  },
  [TransactionType.INVESTIMENT]: {
    label: 'Investido',
    color: '#e93030',
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  depositTotal: number;
  expenseTotal: number;
  investimentTotal: number;
  typesPercentage: TransactionPercentagePerType;
}

const PieChartTransaction = ({
  depositTotal,
  expenseTotal,
  investimentTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.DEPOSITE,
      amount: depositTotal,
      fill: '#55B02E',
    },
    {
      type: TransactionType.EXPENSE,
      amount: expenseTotal,
      fill: '#e93030',
    },
    {
      type: TransactionType.INVESTIMENT,
      amount: investimentTotal,
      fill: '#ffffff',
    },
  ];
  return (
    <Card className="flex flex-col w-1/2 h-[550px] rounded-[20px] max-lg:w-[86%]">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto mt-10 aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mb-14">
        <div className="flex flex-col items-center gap-4 w-[80%]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#181818]">
                <TrendingUp className="text-[#55B02E]" />
              </div>
              <p className="font-normal text-[14px] text-[#71717A]">Receita</p>
            </div>
            <div className="font-large text-[14px]">
              {typesPercentage ? 0 : typesPercentage[TransactionType.EXPENSE]}%
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#181818]">
                <TrendingDown className="text-red-500" />
              </div>
              <p className="font-normal text-[14px] text-[#71717A]">Despezas</p>
            </div>
            <div className="font-large text-[14px]">
              {typesPercentage ? 0 : typesPercentage[TransactionType.EXPENSE]}%
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#181818]">
                <PiggyBankIcon />
              </div>
              <p className="font-normal text-[14px] text-[#71717A]">
                Investimentos
              </p>
            </div>
            <div className="font-large text-[14px]">
              {typesPercentage ? 0 : typesPercentage[TransactionType.EXPENSE]}%
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieChartTransaction;
