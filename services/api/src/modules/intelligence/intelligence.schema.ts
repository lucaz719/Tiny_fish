import { z } from 'zod';

export const createRfqSchema = z.object({
  sellerId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const updateRfqStatusSchema = z.object({
  status: z.enum(['PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED']),
});
