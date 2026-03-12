import { z } from 'zod';

export const createPricingRuleSchema = z.object({
    productId: z.string().uuid(),
    type: z.string().min(1),
    minPrice: z.number().positive(),
    maxPrice: z.number().positive(),
    targetMargin: z.number().optional(),
});

export const createSettlementSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().length(3).optional(),
    periodStart: z.string().datetime(),
    periodEnd: z.string().datetime(),
    metadata: z.any().optional(),
});

export type CreatePricingRuleInput = z.infer<typeof createPricingRuleSchema>;
export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;
