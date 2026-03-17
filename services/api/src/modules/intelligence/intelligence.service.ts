import prisma from '../../lib/prisma.js';
import { Decimal } from '@prisma/client/runtime/library.js';
import { ScraperService } from './scraper.service.js';
import { cacheService } from '../../lib/cache.service.js';

const scraperService = new ScraperService();

export class IntelligenceService {
  async getPriceBenchmark(productId: string) {
    let benchmark = await prisma.priceBenchmark.findUnique({
      where: { productId }
    });

    // If no benchmark or it's older than 24h, recalculate
    if (!benchmark || (new Date().getTime() - new Date(benchmark.calculatedAt).getTime() > 24 * 60 * 60 * 1000)) {
      benchmark = await this.calculateBenchmark(productId);
    }

    return benchmark;
  }

  private async calculateBenchmark(productId: string) {
    const cacheKey = `external_prices:${productId}`;
    let externalPrices = await cacheService.get<number[]>(cacheKey);

    // Aggregate from both B2B Orders and Retail POS Transactions
    const [orderItems, posItems, product] = await Promise.all([
      prisma.orderItem.findMany({ where: { productId }, select: { unitPrice: true } }),
      prisma.posTransactionItem.findMany({ where: { productId }, select: { unitPrice: true } }),
      prisma.product.findUnique({ where: { id: productId }, select: { name: true, sku: true } })
    ]);

    if (!product) return null;

    if (!externalPrices) {
      externalPrices = await scraperService.fetchExternalMarketPrices(product.name, product.sku);
      await cacheService.set(cacheKey, externalPrices, 24 * 60 * 60 * 1000);
    }

    const allPrices = [
      ...orderItems.map(i => Number(i.unitPrice)),
      ...posItems.map(i => Number(i.unitPrice)),
      ...externalPrices
    ].sort((a, b) => a - b);

    if (allPrices.length === 0) return null;

    const marketLow = allPrices[0];
    const marketHigh = allPrices[allPrices.length - 1];
    const midIndex = Math.floor(allPrices.length / 2);
    const marketMedian = allPrices.length % 2 !== 0 
      ? allPrices[midIndex] 
      : (allPrices[midIndex - 1] + allPrices[midIndex]) / 2;

    return prisma.priceBenchmark.upsert({
      where: { productId },
      create: {
        productId,
        marketLow: new Decimal(marketLow),
        marketMedian: new Decimal(marketMedian),
        marketHigh: new Decimal(marketHigh),
        sampleSize: allPrices.length,
      },
      update: {
        marketLow: new Decimal(marketLow),
        marketMedian: new Decimal(marketMedian),
        marketHigh: new Decimal(marketHigh),
        sampleSize: allPrices.length,
        calculatedAt: new Date(),
      }
    });
  }

  async createRfq(buyerId: string, data: any) {
    return prisma.rfq.create({
      data: {
        buyerId,
        sellerId: data.sellerId,
        productId: data.productId,
        quantity: data.quantity,
        status: 'PENDING'
      }
    });
  }

  async getRfqs(tenantId: string) {
    return prisma.rfq.findMany({
      where: {
        OR: [
          { buyerId: tenantId },
          { sellerId: tenantId }
        ]
      },
      include: {
        buyer: { select: { name: true } },
        seller: { select: { name: true } },
        product: { select: { name: true, sku: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateRfqStatus(rfqId: string, tenantId: string, status: string) {
    const rfq = await prisma.rfq.findUnique({ where: { id: rfqId } });
    if (!rfq) throw new Error('RFQ not found');

    // Only buyer or seller can update status (depending on status)
    // For now, allow both for simplicity in workflow
    return prisma.rfq.update({
      where: { id: rfqId },
      data: { status }
    });
  }

  async calculateReliability(tenantId: string) {
    const [orders, reviews] = await Promise.all([
      prisma.order.findMany({ 
        where: { sellerTenantId: tenantId },
        select: { status: true }
      }),
      prisma.review.findMany({
        where: { sellerId: tenantId },
        select: { rating: true }
      })
    ]);

    // Fulfillment Rate
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const fulfillmentRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 100;

    // Rating
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
      : 0;

    // Update Tenant
    return prisma.tenant.update({
      where: { id: tenantId },
      data: {
        fulfillmentRate,
        rating: avgRating
      }
    });
  }
}
