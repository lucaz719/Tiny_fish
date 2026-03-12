import { UserRole } from '@prisma/client';
import { TenantPrismaClient } from '../lib/prisma.js';

declare module 'fastify' {
    interface FastifyRequest {
        prisma: TenantPrismaClient;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: string;
            email: string;
            role: UserRole;
            tenantId: string;
        };
    }
}
