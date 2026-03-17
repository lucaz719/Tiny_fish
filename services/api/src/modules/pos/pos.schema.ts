import { z } from 'zod';

export const openSessionSchema = z.object({
  openingFloat: z.number().min(0),
});

export const closeSessionSchema = z.object({
  closingFloat: z.number().min(0),
});

export const createTransactionSchema = z.object({
  paymentMethod: z.enum(['CASH', 'CARD', 'CREDIT']),
  items: z.array(z.object({
    productId: z.string().uuid(),
    batchId: z.string().uuid().optional().nullable(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
});
