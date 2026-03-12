import { z } from 'zod';

export const createProductSchema = z.object({
    sku: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    category: z.string().optional(),
});

export const createWarehouseSchema = z.object({
    name: z.string().min(1),
    location: z.string().optional(),
});

export const updateInventorySchema = z.object({
    productId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    quantity: z.number().int(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
