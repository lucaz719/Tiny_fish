import { TenantPrismaClient } from '../../lib/prisma.js';
import { AssignDriverInput, CreateDriverInput, CreateShipmentInput, UpdateShipmentStatusInput } from './logistics.schema.js';

export const createDriver = async (prisma: TenantPrismaClient, tenantId: string, input: CreateDriverInput) => {
    return await prisma.driver.create({
        data: {
            ...input,
            tenantId,
        },
    });
};

export const createShipment = async (prisma: TenantPrismaClient, tenantId: string, input: CreateShipmentInput) => {
    const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return await prisma.shipment.create({
        data: {
            trackingNumber,
            orderId: input.orderId,
            estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) : null,
            tenantId,
            status: 'PICKUP_PENDING',
        },
    });
};

export const assignDriver = async (prisma: TenantPrismaClient, shipmentId: string, input: AssignDriverInput) => {
    return await prisma.shipment.update({
        where: { id: shipmentId },
        data: {
            driverId: input.driverId,
        },
    });
};

export const updateShipmentStatus = async (
    prisma: TenantPrismaClient,
    shipmentId: string,
    input: UpdateShipmentStatusInput
) => {
    const data: any = { status: input.status };
    if (input.currentLat !== undefined) data.currentLat = input.currentLat;
    if (input.currentLong !== undefined) data.currentLong = input.currentLong;
    if (input.status === 'DELIVERED') data.actualDelivery = new Date();

    return await prisma.shipment.update({
        where: { id: shipmentId },
        data,
    });
};

export const getShipments = async (prisma: TenantPrismaClient) => {
    return await prisma.shipment.findMany({
        include: {
            order: true,
            driver: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const getDrivers = async (prisma: TenantPrismaClient) => {
    return await prisma.driver.findMany({
        include: {
            shipments: true,
        },
    });
};
