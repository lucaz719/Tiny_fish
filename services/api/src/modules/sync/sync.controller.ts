import { FastifyReply, FastifyRequest } from 'fastify';
import { triggerSync } from './sync.service.js';

export const triggerSyncHandler = async (
    request: FastifyRequest<{ Body: { source: string } }>,
    reply: FastifyReply
) => {
    const { source } = request.body;
    const result = await triggerSync(request.prisma, request.user.tenantId, source);

    if (result.status === 'FAILED') {
        return reply.code(500).send(result);
    }

    return reply.send(result);
};
