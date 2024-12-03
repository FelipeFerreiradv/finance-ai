'use client';

import { useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import UpsertTransactionDialog from '@/app/components/upsert-transaction-dialog';
import { Transaction } from '@prisma/client';

interface EditTransactionButtonProps {
  transaction: Transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button variant={'ghost'} onClick={() => setDialogOpen(true)}>
        <PencilIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        defaultValues={{
          ...transaction,
          amount: Number(transaction.amount),
        }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
