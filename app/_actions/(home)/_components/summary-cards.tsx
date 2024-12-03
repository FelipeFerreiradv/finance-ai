'use client';

import { ReactNode } from 'react';

interface SummaryCardsProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size: 'small' | 'large';
  bg: string;
}

const SummaryCards = ({ icon, title, amount, size, bg }: SummaryCardsProps) => {
  return (
    <div
      className={`${size != 'small' ? 'flex flex-col justify-center px-[2rem] gap-2 w-1/2 h-[130px] border rounded-[20px] bg-[#181818]' : 'flex flex-col justify-center px-[2rem] gap-2 w-1/2 h-[130px] border rounded-[20px] bg-transparent'}`}
    >
      <div className="flex items-center gap-2">
        <div className={bg}>{icon}</div>
        <p>{title}</p>
      </div>
      <h2 className="font-medium text-[24px]">
        {Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount)}
      </h2>
    </div>
  );
};

export default SummaryCards;
