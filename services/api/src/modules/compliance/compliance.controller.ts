import { FastifyReply, FastifyRequest } from 'fastify';
import { ComplianceService } from './compliance.service.js';

const complianceService = new ComplianceService();

export async function registerBatchHandler(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request.user as any).tenantId;
  const batch = await complianceService.registerBatch(tenantId, request.body);
  return reply.code(201).send(batch);
}

export async function getBatchesHandler(request: FastifyRequest, reply: FastifyReply) {
  const { productId } = request.params as { productId: string };
  const batches = await complianceService.getBatches(productId);
  return reply.send(batches);
}

export async function traceBatchHandler(request: FastifyRequest, reply: FastifyReply) {
  const { batchId } = request.params as { batchId: string };
  const trace = await complianceService.traceBatch(batchId);
  return reply.send(trace);
}

export async function uploadLicenseHandler(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request.user as any).tenantId;
  const license = await complianceService.uploadLicense(tenantId, request.body);
  return reply.code(201).send(license);
}

export async function getLicensesHandler(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request.user as any).tenantId;
  const licenses = await complianceService.getLicenses(tenantId);
  return reply.send(licenses);
}

export async function initiateRecallHandler(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request.user as any).tenantId;
  // Only Producer and Admin for now
  const recall = await complianceService.initiateRecall(tenantId, request.body);
  return reply.code(201).send(recall);
}
