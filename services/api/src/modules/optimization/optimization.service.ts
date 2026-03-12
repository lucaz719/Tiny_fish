import { TenantPrismaClient } from '../../lib/prisma.js';
import { CreatePricingRuleInput, CreateSettlementInput } from './optimization.schema.js';

export const createPricingRule = async (prisma: TenantPrismaClient, tenantId: string, input: CreatePricingRuleInput) => {
    return await prisma.pricingRule.create({
        data: {
            ...input,
            tenantId,
        },
    });
};

export const getPricingRules = async (prisma: TenantPrismaClient) => {
    return await prisma.pricingRule.findMany({
        include: {
            product: true,
        },
    });
};

export const createSettlement = async (prisma: TenantPrismaClient, tenantId: string, input: CreateSettlementInput) => {
    return await prisma.settlement.create({
        data: {
            amount: input.amount,
            currency: input.currency || 'PKR',
            periodStart: new Date(input.periodStart),
            periodEnd: new Date(input.periodEnd),
            metadata: input.metadata,
            tenantId,
            status: 'PENDING',
        },
    });
};

export const getSettlements = async (prisma: TenantPrismaClient) => {
    return await prisma.settlement.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};

/**
 * Basic Forecasting Logic (Mover Average)
 * This would be expanded in a real production environment with ML.
 */
export const getInventoryForecast = async (prisma: TenantPrismaClient, productId: string) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const orderItems = await prisma.orderItem.findMany({
        where: {
            productId,
            createdAt: { gte: threeMonthsAgo },
            order: { status: 'DELIVERED' },
        },
    });

    const totalSold = orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const dailyAverage = totalSold / 90;

    const currentInventory = await prisma.inventory.findMany({
        where: { productId },
    });
    const totalInStock = currentInventory.reduce((acc: number, item: any) => acc + item.quantity, 0);

    const daysUntilStockout = dailyAverage > 0 ? totalInStock / dailyAverage : Infinity;

    return {
        productId,
        dailyAverageSales: dailyAverage,
        currentStock: totalInStock,
        daysUntilStockout: Math.round(daysUntilStockout),
        recommendation: daysUntilStockout < 7 ? 'REORDER_NOW' : 'STABLE',
    };
};
