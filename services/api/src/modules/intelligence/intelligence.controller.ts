import { FastifyReply, FastifyRequest } from 'fastify';
import { IntelligenceService } from './intelligence.service.js';
import { createRfqSchema, updateRfqStatusSchema } from './intelligence.schema.js';

const intelligenceService = new IntelligenceService();

export async function getPriceBenchmarkHandler(request: FastifyRequest, reply: FastifyReply) {
  const { productId } = request.params as any;
  const benchmark = await intelligenceService.getPriceBenchmark(productId);
  return reply.send(benchmark);
}

export async function createRfqHandler(request: FastifyRequest, reply: FastifyReply) {
  const { tenantId } = request.user as any;
  const data = createRfqSchema.parse(request.body);
  const rfq = await intelligenceService.createRfq(tenantId, data);
  return reply.code(201).send(rfq);
}

export async function getRfqsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { tenantId } = request.user as any;
  const rfqs = await intelligenceService.getRfqs(tenantId);
  return reply.send(rfqs);
}

export async function updateRfqStatusHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const { tenantId } = request.user as any;
  const data = updateRfqStatusSchema.parse(request.body);
  
  try {
    const updatedRfq = await intelligenceService.updateRfqStatus(id, tenantId, data.status);
    return reply.send(updatedRfq);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function getReliabilityHandler(request: FastifyRequest, reply: FastifyReply) {
  const { tenantId } = request.user as any;
  const reliability = await intelligenceService.calculateReliability(tenantId);
  return reply.send(reliability);
}
