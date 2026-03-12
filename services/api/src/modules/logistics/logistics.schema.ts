import { z } from 'zod';

export const createDriverSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    vehicleInfo: z.string().optional(),
});

export const createShipmentSchema = z.object({
    orderId: z.string().uuid(),
    estimatedDelivery: z.string().datetime().optional(),
});

export const updateShipmentStatusSchema = z.object({
    status: z.enum(['PICKUP_PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED']),
    currentLat: z.number().optional(),
    currentLong: z.number().optional(),
});

export const assignDriverSchema = z.object({
    driverId: z.string().uuid(),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
export type AssignDriverInput = z.infer<typeof assignDriverSchema>;
