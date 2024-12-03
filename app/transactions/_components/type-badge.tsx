import { Badge } from '@/app/components/ui/badge';
import { Transaction, TransactionType } from '@prisma/client';
import { FaCircle } from 'react-icons/fa';

interface TransactionBadgeProps {
  transaction: Transaction;
}

const TransactionBadge = ({ transaction }: TransactionBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSITE) {
    return (
      <Badge
        variant={'secondary'}
        className="text-[12px] text-[#55B02E] bg-[#55B02E14]"
      >
        <FaCircle className="text-[8px] mr-2" /> Ganho
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge
        variant={'secondary'}
        className="text-[12px] text-[#E93030] bg-[#E9303014]"
      >
        <FaCircle className="text-[8px] mr-2" /> Gasto
      </Badge>
    );
  } else {
    return (
      <Badge variant={'secondary'} className="text-[12px]">
        <FaCircle className="text-[8px] mr-2" /> Investimento
      </Badge>
    );
  }
};

export default TransactionBadge;
