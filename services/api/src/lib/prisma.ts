import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTenantClient = (tenantId: string, role: string) => {
    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ args, query }: { args: any; query: (args: any) => Promise<any> }) {
                    return prisma.$transaction(async (tx: any) => {
                        await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
                        await tx.$executeRaw`SELECT set_config('app.user_role', ${role}, true)`;
                        return query(args);
                    });
                },
            },
        },
    });
};

export default prisma;
export type TenantPrismaClient = ReturnType<typeof getTenantClient>;
