import { TenantPrismaClient } from '../../lib/prisma.js';

export const getInventoryAnalytics = async (prisma: TenantPrismaClient) => {
    const inventory = await prisma.inventory.findMany({
        select: {
            quantity: true,
            productId: true,
        },
    });

    const totalStock = inventory.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
    const outOfStockCount = inventory.filter((item: { quantity: number }) => item.quantity <= 0).length;
    const lowStockCount = inventory.filter((item: { quantity: number }) => item.quantity > 0 && item.quantity < 10).length;

    return {
        totalStock,
        outOfStockCount,
        lowStockCount,
        totalItems: inventory.length,
    };
};

export const getSalesAnalytics = async (prisma: TenantPrismaClient) => {
    const orders = await prisma.order.findMany({
        select: {
            totalAmount: true,
            status: true,
            createdAt: true,
        },
    });

    const totalRevenue = orders
        .filter((o: { status: string; totalAmount: any }) => o.status !== 'CANCELLED')
        .reduce((acc: number, o: { totalAmount: any }) => acc + Number(o.totalAmount), 0);

    const ordersByStatus = orders.reduce((acc: Record<string, number>, o: { status: string }) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {});

    return {
        totalSales: orders.length,
        totalRevenue,
        ordersByStatus,
    };
};

export const getSyncAnalytics = async (prisma: TenantPrismaClient) => {
    const logs = await prisma.syncLog.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
    });

    const totalSyncs = logs.length;
    const successCount = logs.filter((l: { status: string }) => l.status === 'SUCCESS').length;
    const avgDuration = logs.length > 0
        ? logs.reduce((acc: number, l: { durationMs: number }) => acc + l.durationMs, 0) / logs.length
        : 0;

    return {
        totalSyncs,
        successRate: totalSyncs > 0 ? (successCount / totalSyncs) * 100 : 0,
        avgDurationMs: avgDuration,
        recentLog: logs[0] || null,
    };
};

export const getDashboardSummary = async (prisma: TenantPrismaClient) => {
    const [inventory, sales, sync] = await Promise.all([
        getInventoryAnalytics(prisma),
        getSalesAnalytics(prisma),
        getSyncAnalytics(prisma),
    ]);

    return {
        inventory,
        sales,
        sync,
    };
};
