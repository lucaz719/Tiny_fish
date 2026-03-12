import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import basePrisma, { getTenantClient } from '../lib/prisma.js';

declare module 'fastify' {
    interface FastifyRequest {
        prisma: any;
    }
}

const prismaPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
    // Decorate request with a getter to lazily initialize the tenant client
    app.decorateRequest('prisma', {
        getter() {
            if (this.user) {
                return getTenantClient(this.user.tenantId, this.user.role);
            }
            return basePrisma;
        }
    });
};

export default fp(prismaPlugin);
