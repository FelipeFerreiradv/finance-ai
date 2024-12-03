'use client';

import { Transaction } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import TransactionTypeBadge from '../_components/type-badge';
import EditTransactionButton from '../_components/edit-transaction-button';
import DeleteTransactionButton from '../_components/delete-transaction-button';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const TRANSACTION_CATEGORY_LABELS = {
  HOUSING: 'Habitação',
  TRANSPORTATION: 'Transporte',
  FOOD: 'Comida',
  ENTERTAINMENT: 'Entretenimento',
  HEALTH: 'Saude',
  UTILITY: 'Utilidade',
  SALARY: 'Salário',
  EDUCATION: 'Educação',
  OTHER: '-',
};

export const TRANSACTION_PAYMENTMETHOD_LABELS = {
  CASH: 'Dinheiro',
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
  BANK_TRANSFER: 'Transferência bancária',
  BANK_SPLIT: 'Divisão Bancária',
  OTHER: 'Outros',
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_CATEGORY_LABELS[transaction.category],
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Método',
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENTMETHOD_LABELS[transaction.paymentMethod],
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString('pt-br', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat('pt-br', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(transaction.amount)),
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: ({ row: { original: transaction } }) => {
      return (
        <section className="flex items-center gap-2">
          <div>
            <EditTransactionButton transaction={transaction} />
          </div>
          <div>
            <DeleteTransactionButton transactionId={transaction.id} />
          </div>
        </section>
      );
    },
  },
];
