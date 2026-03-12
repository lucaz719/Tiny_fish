import { TenantPrismaClient } from '../../lib/prisma.js';
import { CreateOrderInput, UpdateOrderStatusInput } from './order.schema.js';

export const createOrder = async (
    prisma: TenantPrismaClient,
    buyerTenantId: string,
    createdById: string,
    input: CreateOrderInput
) => {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const totalAmount = input.items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
    );

    return await prisma.order.create({
        data: {
            orderNumber,
            buyerTenantId,
            sellerTenantId: input.sellerTenantId,
            createdById,
            totalAmount,
            status: 'PENDING',
            items: {
                create: input.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.quantity * item.unitPrice,
                })),
            },
        },
        include: {
            items: true,
            buyerTenant: true,
            sellerTenant: true,
        },
    });
};

export const getOrders = async (prisma: TenantPrismaClient) => {
    return await prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            buyerTenant: true,
            sellerTenant: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const updateOrderStatus = async (
    prisma: TenantPrismaClient,
    orderId: string,
    input: UpdateOrderStatusInput
) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: { status: input.status },
        include: {
            items: true,
        },
    });
};
