import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { createUser, validateUser } from './auth.service.js';

export const registerHandler = async (
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
) => {
    try {
        const { user, tenant } = await createUser(request.body);
        return reply.code(201).send({
            message: 'Registration successful. Waiting for admin approval.',
            user: { id: user.id, email: user.email },
            tenant: { id: tenant.id, name: tenant.name },
        });
    } catch (err: any) {
        if (err.code === 'P2002') {
            return reply.code(409).send({ error: 'Email already exists' });
        }
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

export const loginHandler = async (
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
) => {
    const user = await validateUser(request.body);

    if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = await reply.jwtSign({
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
    });

    return reply.send({
        token,
        user: { id: user.id, email: user.email, role: user.role },
    });
};
