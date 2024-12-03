import { z } from 'zod';

export const deteleTransactionSchema = z.object({
  transactionId: z.string().uuid(),
});

export type DeteleTransactionSchema = z.infer<typeof deteleTransactionSchema>;
