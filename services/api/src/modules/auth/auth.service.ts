import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';
import { RegisterInput, LoginInput } from './auth.schema.js';

export const createUser = async (input: RegisterInput) => {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const tenant = await tx.tenant.create({
            data: {
                name: input.name,
                type: input.type,
                country: input.country,
            },
        });

        const user = await tx.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                tenantId: tenant.id,
                role: `${input.type}_OWNER` as any, // Simple role mapping for now
                status: 'PENDING',
            },
        });

        return { user, tenant };
    });
};

export const validateUser = async (input: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { tenant: true },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) return null;

    return user;
};
