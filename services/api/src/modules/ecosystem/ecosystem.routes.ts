import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
  createApiKeyHandler,
  createWebhookHandler,
  deleteWebhookHandler,
  listApiKeysHandler,
  listWebhooksHandler,
  queryAuditLogsHandler,
  revokeApiKeyHandler,
  updateWebhookHandler,
} from './ecosystem.controller.js';

const ecosystemRoutes = async (app: FastifyInstance) => {
  // All ecosystem routes require authentication
  app.addHook('preHandler', authenticate);

  // ── Webhooks ──────────────────────────────────────────
  app.post('/webhooks', createWebhookHandler as any);
  app.get('/webhooks', listWebhooksHandler as any);
  app.patch('/webhooks/:id', updateWebhookHandler as any);
  app.delete('/webhooks/:id', deleteWebhookHandler as any);

  // ── Audit Logs ────────────────────────────────────────
  app.get('/audit-logs', queryAuditLogsHandler as any);

  // ── API Keys ──────────────────────────────────────────
  app.post('/api-keys', createApiKeyHandler as any);
  app.get('/api-keys', listApiKeysHandler as any);
  app.delete('/api-keys/:id', revokeApiKeyHandler as any);
};

export default ecosystemRoutes;
