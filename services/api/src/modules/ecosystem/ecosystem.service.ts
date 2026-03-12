import crypto from 'crypto';
import { TenantPrismaClient } from '../../lib/prisma.js';
import {
  CreateApiKeyInput,
  CreateWebhookInput,
  QueryAuditLogInput,
  UpdateWebhookInput,
} from './ecosystem.schema.js';

// Helper to access models on extended prisma client
const db = (prisma: TenantPrismaClient) => prisma as any;

// ═══════════════════════════════════════════════════════════
// WEBHOOK MANAGEMENT
// ═══════════════════════════════════════════════════════════

export const createWebhook = async (prisma: TenantPrismaClient, tenantId: string, input: CreateWebhookInput) => {
  return db(prisma).webhookConfig.create({
    data: {
      url: input.url,
      eventTypes: input.eventTypes,
      secret: input.secret,
      tenantId,
    },
  });
};

export const listWebhooks = async (prisma: TenantPrismaClient, tenantId: string) => {
  return db(prisma).webhookConfig.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateWebhook = async (prisma: TenantPrismaClient, id: string, input: UpdateWebhookInput) => {
  return db(prisma).webhookConfig.update({
    where: { id },
    data: input,
  });
};

export const deleteWebhook = async (prisma: TenantPrismaClient, id: string) => {
  return db(prisma).webhookConfig.delete({ where: { id } });
};

/**
 * Dispatches an event to all registered webhooks for a tenant.
 * In production, this would use a queue (e.g., BullMQ) for reliability.
 */
export const dispatchEvent = async (
  prisma: TenantPrismaClient,
  tenantId: string,
  eventType: string,
  payload: any
) => {
  const webhooks = await db(prisma).webhookConfig.findMany({
    where: {
      tenantId,
      isActive: true,
      eventTypes: { has: eventType },
    },
  });

  const results = await Promise.allSettled(
    webhooks.map(async (webhook: any) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Event-Type': eventType,
      };

      if (webhook.secret) {
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify(payload))
          .digest('hex');
        headers['X-Webhook-Signature'] = signature;
      }

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ event: eventType, data: payload, timestamp: new Date().toISOString() }),
      });

      return { webhookId: webhook.id, status: response.status };
    })
  );

  return results;
};

// ═══════════════════════════════════════════════════════════
// AUDIT LOGGING
// ═══════════════════════════════════════════════════════════

export const createAuditLog = async (
  prisma: TenantPrismaClient,
  tenantId: string,
  data: {
    entityType: string;
    entityId: string;
    action: string;
    oldValue?: any;
    newValue?: any;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }
) => {
  return db(prisma).auditLog.create({
    data: {
      ...data,
      tenantId,
    },
  });
};

export const queryAuditLogs = async (prisma: TenantPrismaClient, tenantId: string, input: QueryAuditLogInput) => {
  return db(prisma).auditLog.findMany({
    where: {
      tenantId,
      ...(input.entityType && { entityType: input.entityType }),
      ...(input.action && { action: input.action }),
      ...(input.startDate || input.endDate
        ? {
            createdAt: {
              ...(input.startDate && { gte: new Date(input.startDate) }),
              ...(input.endDate && { lte: new Date(input.endDate) }),
            },
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: input.limit ?? 50,
    include: {
      user: { select: { email: true } },
    },
  });
};

// ═══════════════════════════════════════════════════════════
// API KEY MANAGEMENT
// ═══════════════════════════════════════════════════════════

const generateApiKey = (): string => {
  return `gs_${crypto.randomBytes(32).toString('hex')}`;
};

export const createApiKey = async (prisma: TenantPrismaClient, tenantId: string, input: CreateApiKeyInput) => {
  const key = generateApiKey();
  const apiKey = await db(prisma).apiKey.create({
    data: {
      key,
      name: input.name,
      scopes: input.scopes,
      tenantId,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  });

  // Return the raw key only once on creation
  return { ...apiKey, rawKey: key };
};

export const listApiKeys = async (prisma: TenantPrismaClient, tenantId: string) => {
  return db(prisma).apiKey.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
      scopes: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
      // Intentionally omit `key` for security
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const revokeApiKey = async (prisma: TenantPrismaClient, id: string) => {
  return db(prisma).apiKey.delete({ where: { id } });
};

export const validateApiKey = async (prisma: TenantPrismaClient, key: string) => {
  const apiKey = await db(prisma).apiKey.findUnique({ where: { key } });

  if (!apiKey) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Update last used timestamp
  await db(prisma).apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKey;
};
