import { z } from 'zod';

export const createReviewSchema = z.object({
    orderId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
});

export const searchMarketplaceSchema = z.object({
    query: z.string().optional(),
    type: z.enum(['VENDOR', 'PRODUCT']).optional(),
    minRating: z.number().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type SearchMarketplaceInput = z.infer<typeof searchMarketplaceSchema>;
