import { z } from 'zod';

// --- Webhook ---
export const createWebhookSchema = z.object({
  url: z.string().url(),
  eventTypes: z.array(z.string()).min(1),
  secret: z.string().optional(),
});

export const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  eventTypes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// --- API Key ---
export const createApiKeySchema = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).min(1), // e.g., ["read:orders", "write:inventory"]
  expiresAt: z.string().datetime().optional(),
});

// --- Audit Log ---
export const queryAuditLogSchema = z.object({
  entityType: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>;
export type UpdateWebhookInput = z.infer<typeof updateWebhookSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type QueryAuditLogInput = z.infer<typeof queryAuditLogSchema>;
