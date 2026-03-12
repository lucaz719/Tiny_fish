import { z } from 'zod';

export const updateTenantSchema = z.object({
    name: z.string().min(2).optional(),
    country: z.string().optional(),
    bio: z.string().max(500).optional(),
    logoUrl: z.string().url().optional(),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
