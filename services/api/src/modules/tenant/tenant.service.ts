import { TenantPrismaClient } from '../../lib/prisma.js';
import { UpdateTenantInput } from './tenant.schema.js';

export const getMyTenant = async (prisma: TenantPrismaClient, tenantId: string) => {
    // With RLS, this findUnique would fail if the tenantId doesn't match the context
    // but we can also use it as a guard.
    return await prisma.tenant.findUnique({
        where: { id: tenantId },
    });
};

export const updateTenant = async (
    prisma: TenantPrismaClient,
    tenantId: string,
    input: UpdateTenantInput
) => {
    return await prisma.tenant.update({
        where: { id: tenantId },
        data: input,
    });
};
