import { FastifyReply, FastifyRequest } from 'fastify';
import { PosService } from './pos.service.js';
import { openSessionSchema, closeSessionSchema, createTransactionSchema } from './pos.schema.js';

const posService = new PosService();

export async function openSessionHandler(request: FastifyRequest, reply: FastifyReply) {
  const { tenantId, id: userId } = request.user as any;
  const data = openSessionSchema.parse(request.body);
  
  try {
    const session = await posService.openSession(tenantId, userId, data.openingFloat);
    return reply.code(201).send(session);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function closeSessionHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = closeSessionSchema.parse(request.body);
  
  try {
    const session = await posService.closeSession(id, data.closingFloat);
    return reply.send(session);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function createTransactionHandler(request: FastifyRequest, reply: FastifyReply) {
  const { sessionId } = request.params as any;
  const data = createTransactionSchema.parse(request.body);
  
  try {
    const transaction = await posService.createTransaction(sessionId, data);
    return reply.code(201).send(transaction);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function getSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { tenantId } = request.user as any;
  const sessions = await posService.getSessions(tenantId);
  return reply.send(sessions);
}

export async function getSessionTransactionsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { sessionId } = request.params as any;
  const transactions = await posService.getSessionTransactions(sessionId);
  return reply.send(transactions);
}
