import { FastifyReply, FastifyRequest } from 'fastify';
import {
    AssignDriverInput,
    CreateDriverInput,
    CreateShipmentInput,
    UpdateShipmentStatusInput,
} from './logistics.schema.js';
import {
    assignDriver,
    createDriver,
    createShipment,
    getDrivers,
    getShipments,
    updateShipmentStatus,
} from './logistics.service.js';

export const createDriverHandler = async (
    request: FastifyRequest<{ Body: CreateDriverInput }>,
    reply: FastifyReply
) => {
    const driver = await createDriver(request.prisma, request.user.tenantId, request.body);
    return reply.code(201).send(driver);
};

export const createShipmentHandler = async (
    request: FastifyRequest<{ Body: CreateShipmentInput }>,
    reply: FastifyReply
) => {
    const shipment = await createShipment(request.prisma, request.user.tenantId, request.body);
    return reply.code(201).send(shipment);
};

export const assignDriverHandler = async (
    request: FastifyRequest<{ Params: { id: string }; Body: AssignDriverInput }>,
    reply: FastifyReply
) => {
    const shipment = await assignDriver(request.prisma, request.params.id, request.body);
    return reply.send(shipment);
};

export const updateShipmentStatusHandler = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateShipmentStatusInput }>,
    reply: FastifyReply
) => {
    const shipment = await updateShipmentStatus(request.prisma, request.params.id, request.body);
    return reply.send(shipment);
};

export const getShipmentsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const shipments = await getShipments(request.prisma);
    return reply.send(shipments);
};

export const getDriversHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const drivers = await getDrivers(request.prisma);
    return reply.send(drivers);
};
