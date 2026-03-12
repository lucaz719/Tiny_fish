import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateApiKeyInput,
  CreateWebhookInput,
  QueryAuditLogInput,
  UpdateWebhookInput,
} from './ecosystem.schema.js';
import {
  createApiKey,
  createWebhook,
  deleteWebhook,
  listApiKeys,
  listWebhooks,
  queryAuditLogs,
  revokeApiKey,
  updateWebhook,
} from './ecosystem.service.js';

// --- Webhook Handlers ---

export const createWebhookHandler = async (
  request: FastifyRequest<{ Body: CreateWebhookInput }>,
  reply: FastifyReply
) => {
  const webhook = await createWebhook(request.prisma, request.user.tenantId, request.body);
  return reply.code(201).send(webhook);
};

export const listWebhooksHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const webhooks = await listWebhooks(request.prisma, request.user.tenantId);
  return reply.send(webhooks);
};

export const updateWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateWebhookInput }>,
  reply: FastifyReply
) => {
  const webhook = await updateWebhook(request.prisma, request.params.id, request.body);
  return reply.send(webhook);
};

export const deleteWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  await deleteWebhook(request.prisma, request.params.id);
  return reply.code(204).send();
};

// --- Audit Log Handlers ---

export const queryAuditLogsHandler = async (
  request: FastifyRequest<{ Querystring: QueryAuditLogInput }>,
  reply: FastifyReply
) => {
  const logs = await queryAuditLogs(request.prisma, request.user.tenantId, request.query);
  return reply.send(logs);
};

// --- API Key Handlers ---

export const createApiKeyHandler = async (
  request: FastifyRequest<{ Body: CreateApiKeyInput }>,
  reply: FastifyReply
) => {
  const apiKey = await createApiKey(request.prisma, request.user.tenantId, request.body);
  return reply.code(201).send(apiKey);
};

export const listApiKeysHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const keys = await listApiKeys(request.prisma, request.user.tenantId);
  return reply.send(keys);
};

export const revokeApiKeyHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  await revokeApiKey(request.prisma, request.params.id);
  return reply.code(204).send();
};
