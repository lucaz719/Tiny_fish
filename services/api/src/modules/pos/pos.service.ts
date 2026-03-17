import prisma from '../../lib/prisma.js';
import { Decimal } from '@prisma/client/runtime/library.js';

export class PosService {
  async openSession(tenantId: string, userId: string, openingFloat: number) {
    // Check if user already has an active session
    const activeSession = await prisma.posSession.findFirst({
      where: {
        tenantId,
        openedById: userId,
        status: 'ACTIVE',
      }
    });

    if (activeSession) {
      throw new Error('User already has an active POS session');
    }

    return prisma.posSession.create({
      data: {
        tenantId,
        openedById: userId,
        openingFloat: new Decimal(openingFloat),
        status: 'ACTIVE',
      }
    });
  }

  async closeSession(sessionId: string, closingFloat: number) {
    return prisma.posSession.update({
      where: { id: sessionId },
      data: {
        closingFloat: new Decimal(closingFloat),
        closedAt: new Date(),
        status: 'PENDING', // Marking as pending review or similar
      }
    });
  }

  async createTransaction(sessionId: string, data: any) {
    const session = await prisma.posSession.findUnique({
      where: { id: sessionId }
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new Error('Invalid or inactive session');
    }

    const totalAmount = data.items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);

    return prisma.$transaction(async (tx) => {
      // 1. Create Transaction
      const transaction = await tx.posTransaction.create({
        data: {
          sessionId,
          totalAmount: new Decimal(totalAmount),
          paymentMethod: data.paymentMethod,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              batchId: item.batchId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              totalPrice: new Decimal(item.quantity * item.unitPrice),
            }))
          }
        },
        include: { items: true }
      });

      // 2. Decrement Inventory
      for (const item of data.items) {
        // Find inventory for this tenant/warehouse
        // For simplicity in MVP, we track general tenant inventory if specific warehouse isn't selected
        const inventory = await tx.inventory.findFirst({
          where: {
            productId: item.productId,
            tenantId: session.tenantId,
          }
        });

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product id ${item.productId}`);
        }

        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } }
        });
        
        // Audit Log Entry
        await tx.auditLog.create({
          data: {
            tenantId: session.tenantId,
            userId: session.openedById,
            action: 'POS_SALE',
            entityType: 'INVENTORY',
            entityId: inventory.id,
            newValue: { quantity: inventory.quantity - item.quantity },
            oldValue: { quantity: inventory.quantity }
          }
        });
      }

      return transaction;
    });
  }

  async getSessions(tenantId: string) {
    return prisma.posSession.findMany({
      where: { tenantId },
      include: { openedBy: { select: { email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSessionTransactions(sessionId: string) {
    return prisma.posTransaction.findMany({
      where: { sessionId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
