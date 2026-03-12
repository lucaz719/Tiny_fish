import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProductInput, CreateWarehouseInput, UpdateInventoryInput } from './inventory.schema.js';
import { createProduct, createWarehouse, getInventory, upsertInventory } from './inventory.service.js';

export const createProductHandler = async (
    request: FastifyRequest<{ Body: CreateProductInput }>,
    reply: FastifyReply
) => {
    const product = await createProduct(request.prisma, request.user.tenantId, request.body);
    return reply.code(201).send(product);
};

export const createWarehouseHandler = async (
    request: FastifyRequest<{ Body: CreateWarehouseInput }>,
    reply: FastifyReply
) => {
    const warehouse = await createWarehouse(request.prisma, request.user.tenantId, request.body);
    return reply.code(201).send(warehouse);
};

export const upsertInventoryHandler = async (
    request: FastifyRequest<{ Body: UpdateInventoryInput }>,
    reply: FastifyReply
) => {
    const inventory = await upsertInventory(request.prisma, request.user.tenantId, request.body);
    return reply.send(inventory);
};

export const getInventoryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const inventory = await getInventory(request.prisma);
    return reply.send(inventory);
};
