import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    type: z.enum(['MARKETPLACE_OPERATOR', 'DISTRIBUTOR', 'WHOLESALER', 'RETAILER', 'PRODUCER']),
    country: z.string(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
