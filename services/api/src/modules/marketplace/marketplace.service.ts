import { TenantPrismaClient } from '../../lib/prisma.js';
import { CreateReviewInput, SearchMarketplaceInput } from './marketplace.schema.js';

export const submitReview = async (prisma: TenantPrismaClient, buyerTenantId: string, input: CreateReviewInput) => {
    // Verify order exists and belongs to this buyer
    const order = await prisma.order.findUnique({
        where: { id: input.orderId },
        include: { shipment: true },
    });

    if (!order || order.buyerTenantId !== buyerTenantId) {
        throw new Error('Order not found or access denied');
    }

    // Optional: Check if order is DELIVERED
    if (order.status !== 'DELIVERED') {
        throw new Error('Can only review delivered orders');
    }

    const review = await prisma.review.create({
        data: {
            orderId: input.orderId,
            buyerId: buyerTenantId,
            sellerId: order.sellerTenantId,
            rating: input.rating,
            comment: input.comment,
        },
    });

    // Automatically update seller's average rating
    const sellerReviews = await prisma.review.findMany({
        where: { sellerId: order.sellerTenantId },
    });

    const averageRating = sellerReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / sellerReviews.length;

    await prisma.tenant.update({
        where: { id: order.sellerTenantId },
        data: { rating: averageRating },
    });

    return review;
};

export const searchMarketplace = async (prisma: TenantPrismaClient, input: SearchMarketplaceInput) => {
    if (input.type === 'PRODUCT') {
        return await prisma.product.findMany({
            where: {
                AND: [
                    input.query ? { name: { contains: input.query, mode: 'insensitive' } } : {},
                    input.minRating ? { tenant: { rating: { gte: input.minRating } } } : {},
                ],
            },
            include: {
                tenant: true,
            },
        });
    }

    return await prisma.tenant.findMany({
        where: {
            AND: [
                input.query ? { name: { contains: input.query, mode: 'insensitive' } } : {},
                input.minRating ? { rating: { gte: input.minRating } } : {},
            ],
        },
        include: {
            products: { take: 5 },
            reviewsReceived: { take: 3 },
        },
    });
};

export const getVendorProfile = async (prisma: TenantPrismaClient, vendorId: string) => {
    return await prisma.tenant.findUnique({
        where: { id: vendorId },
        include: {
            products: true,
            reviewsReceived: {
                include: {
                    buyer: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });
};
