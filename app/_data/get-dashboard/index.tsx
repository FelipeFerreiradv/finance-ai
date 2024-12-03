import { db } from '@/app/_lib/prisma';
import { TotalExpensesPerCategory, TransactionPercentagePerType } from './type';
import { TransactionType } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

export const getDashBoard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const where = {
    userId,
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
    )?._sum?.amount || 0
  );

  const investimentTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'INVESTIMENT' },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );

  const expenseTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );

  const transactionTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );

  const balance = depositTotal - investimentTotal - expenseTotal;

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSITE]: Math.round(
      (Number(depositTotal || 0) / Number(transactionTotal)) * 100
    ),
    [TransactionType.EXPENSE]: Math.round(
      (Number(expenseTotal || 0) / Number(transactionTotal)) * 100
    ),
    [TransactionType.INVESTIMENT]: Math.round(
      (Number(investimentTotal || 0) / Number(transactionTotal)) * 100
    ),
  };

  // Obter as despesas por categoria
  const expensePerCategory = await db.transaction.groupBy({
    by: ['category'],
    where: {
      ...where,
      type: TransactionType.EXPENSE,
    },
    _sum: {
      amount: true,
    },
  });

  // Mapear os resultados para o formato TotalExpensesPerCategory
  const totalExpensePerCategory: TotalExpensesPerCategory[] =
    expensePerCategory.map((category) => ({
      category: category.category,
      totalAmount: Number(category._sum.amount),
      percentageOfTotal: Math.round(
        (Number(category._sum.amount) / Number(expenseTotal)) * 100
      ),
    }));

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
    take: 15,
  });

  return {
    balance,
    depositTotal,
    investimentTotal,
    expenseTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
