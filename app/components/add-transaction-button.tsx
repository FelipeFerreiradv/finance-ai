'use client';

import { useState } from 'react';
import UpsertTransactionDialog from './upsert-transaction-dialog';
import { Button } from './ui/button';
import { ArrowDownUpIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={'outline'}
              className="w-[180px] h-[35px] rounded-full font-bold bg-[#55B02E]"
              onClick={() => setDialogOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Adicionar Transação
              <ArrowDownUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              'Você atingiu o limite de transações. Atualize seu Plano!'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UpsertTransactionDialog isOpen={dialogOpen} setIsOpen={setDialogOpen} />
    </>
  );
};

export default AddTransactionButton;
