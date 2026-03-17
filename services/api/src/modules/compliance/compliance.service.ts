import prisma from '../../lib/prisma.js';

export class ComplianceService {
  async registerBatch(tenantId: string, data: any) {
    return prisma.batch.create({
      data: {
        productId: data.productId,
        batchNumber: data.batchNumber,
        manufactureDate: new Date(data.manufactureDate),
        expiryDate: new Date(data.expiryDate),
        initialQuantity: data.initialQuantity,
        status: 'ACTIVE'
      }
    });
  }

  async getBatches(productId: string) {
    return prisma.batch.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addCustodyRecord(batchId: string, fromTenantId: string | null, toTenantId: string, quantity: number, documentRef?: string) {
    return prisma.custodyRecord.create({
      data: {
        batchId,
        fromTenantId,
        toTenantId,
        quantity,
        documentRef
      }
    });
  }

  async traceBatch(batchId: string) {
    const custodyRecords = await prisma.custodyRecord.findMany({
      where: { batchId },
      include: {
        fromTenant: { select: { name: true, type: true } },
        toTenant: { select: { name: true, type: true } }
      },
      orderBy: { transferDate: 'asc' }
    });

    return custodyRecords;
  }

  async uploadLicense(tenantId: string, data: any) {
    return prisma.complianceLicense.create({
      data: {
        tenantId,
        type: data.type,
        number: data.number,
        issuingAuthority: data.issuingAuthority,
        issueDate: new Date(data.issueDate),
        expiryDate: new Date(data.expiryDate),
        status: 'ACTIVE',
        documentUrl: data.documentUrl
      }
    });
  }

  async getLicenses(tenantId: string) {
    return prisma.complianceLicense.findMany({
      where: { tenantId },
      orderBy: { expiryDate: 'asc' }
    });
  }

  async initiateRecall(initiatedById: string, data: any) {
    const recall = await prisma.recall.create({
      data: {
        initiatedById,
        productId: data.productId,
        batchIds: data.batchIds,
        severity: data.severity,
        reason: data.reason,
        status: 'OPEN'
      }
    });

    // Mark affected batches as RECALLED
    await prisma.batch.updateMany({
      where: { id: { in: data.batchIds } },
      data: { status: 'RECALLED' }
    });

    return recall;
  }
}
