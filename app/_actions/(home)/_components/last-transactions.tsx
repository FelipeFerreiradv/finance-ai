import { formatCurrency } from '@/app/_untils/currenc';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Transaction, TransactionPaymentMethod } from '@prisma/client';
import { RectangleEllipsis } from 'lucide-react';
// import Image from 'next/image';

interface LastTransactionsProps {
  lastTransactions: Transaction[];
}

export const TRANSACTION_PAYMENTMETHOD_LABELS_ICONS = {
  [TransactionPaymentMethod.CASH]: 'money.svg',
  [TransactionPaymentMethod.PIX]: 'pix.svg',
  [TransactionPaymentMethod.CREDIT_CARD]: 'credit-card.svg',
  [TransactionPaymentMethod.DEBIT_CARD]: 'debit-card.svg',
  [TransactionPaymentMethod.BANK_TRANSFER]: 'bank-transfer.svg',
  [TransactionPaymentMethod.BANK_SPLIT]: 'bank-splip.svg',
  [TransactionPaymentMethod.OTHER]: 'other.svg',
};

const LastTransactions = ({ lastTransactions = [] }: LastTransactionsProps) => {
  const getPriceColor = (transaction: Transaction) => {
    if (transaction.type === 'DEPOSITE') {
      return 'text-[#55B02E]';
    } else if (transaction.type === 'EXPENSE') {
      return 'text-red-500';
    } else {
      return 'text-white';
    }
  };

  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === 'DEPOSITE') {
      return '+';
    } else if (transaction.type === 'EXPENSE') {
      return '-';
    } else {
      return '-';
    }
  };
  return (
    <ScrollArea className="w-1/2 border rounded-[20px] p-10 mr-[2rem]">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[18px]">Transações</h1>
        <Button
          variant="outline"
          className="w-[82px] h-[35px] border rounded-full font-bold text-[12px]"
        >
          Ver mais
        </Button>
      </div>
      <div className="w-full h-[.1px] mt-8 mb-7 border bg-[#FFFFFF14]"></div>
      {lastTransactions.map((transaction) => (
        <section key={transaction.id}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[8px] bg-[#191919]">
                <RectangleEllipsis width={16} />
                {/* <Image
                  src={
                    TRANSACTION_PAYMENTMETHOD_LABELS_ICONS[
                      transaction.paymentMethod
                    ]
                  }
                  alt="pix"
                  width={20}
                  height={20}
                /> */}
              </div>
              <div className="flex flex-col gap-[.3rem]">
                <h2 className="font-bold text-[14px]">{transaction.name}</h2>
                <p className="font-normal text-[14px] text-[#71717A]">
                  {new Date(transaction.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div>
              <p
                className={`font-bold text-[14px] ${getPriceColor(transaction)}`}
              >
                {getAmountColor(transaction)}
                {formatCurrency(Number(transaction.amount))}
              </p>
            </div>
          </div>
        </section>
      ))}
    </ScrollArea>
  );
};

export default LastTransactions;
