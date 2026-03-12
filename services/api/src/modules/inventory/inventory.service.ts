import { TenantPrismaClient } from '../../lib/prisma.js';
import { CreateProductInput, CreateWarehouseInput, UpdateInventoryInput } from './inventory.schema.js';

export const createProduct = async (prisma: TenantPrismaClient, tenantId: string, input: CreateProductInput) => {
    return await prisma.product.create({
        data: {
            ...input,
            tenantId,
        },
    });
};

export const createWarehouse = async (prisma: TenantPrismaClient, tenantId: string, input: CreateWarehouseInput) => {
    return await prisma.warehouse.create({
        data: {
            ...input,
            tenantId,
        },
    });
};

export const upsertInventory = async (prisma: TenantPrismaClient, tenantId: string, input: UpdateInventoryInput) => {
    return await prisma.inventory.upsert({
        where: {
            productId_warehouseId: {
                productId: input.productId,
                warehouseId: input.warehouseId,
            },
        },
        update: {
            quantity: input.quantity,
        },
        create: {
            productId: input.productId,
            warehouseId: input.warehouseId,
            quantity: input.quantity,
            tenantId,
        },
    });
};

export const getInventory = async (prisma: TenantPrismaClient) => {
    return await prisma.inventory.findMany({
        include: {
            product: true,
            warehouse: true,
        },
    });
};
