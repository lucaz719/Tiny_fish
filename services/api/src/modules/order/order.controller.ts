import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateOrderInput, UpdateOrderStatusInput } from './order.schema.js';
import { createOrder, getOrders, updateOrderStatus } from './order.service.js';

export const createOrderHandler = async (
    request: FastifyRequest<{ Body: CreateOrderInput }>,
    reply: FastifyReply
) => {
    const order = await createOrder(
        request.prisma,
        request.user.tenantId,
        request.user.id,
        request.body
    );
    return reply.code(201).send(order);
};

export const getOrdersHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const orders = await getOrders(request.prisma);
    return reply.send(orders);
};

export const updateOrderStatusHandler = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateOrderStatusInput }>,
    reply: FastifyReply
) => {
    const order = await updateOrderStatus(request.prisma, request.params.id, request.body);
    return reply.send(order);
};
