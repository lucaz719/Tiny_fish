import { FastifyReply, FastifyRequest } from 'fastify';
import { UpdateTenantInput } from './tenant.schema.js';
import { getMyTenant, updateTenant } from './tenant.service.js';

export const getMyTenantHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const tenant = await getMyTenant(request.prisma, request.user.tenantId);
    return reply.send(tenant);
};

export const updateTenantHandler = async (
    request: FastifyRequest<{ Body: UpdateTenantInput }>,
    reply: FastifyReply
) => {
    const tenant = await updateTenant(request.prisma, request.user.tenantId, request.body);
    return reply.send(tenant);
};
