import { FastifyReply, FastifyRequest } from 'fastify';
import { getDashboardSummary, getInventoryAnalytics, getSalesAnalytics, getSyncAnalytics } from './analytics.service.js';

export const getDashboardSummaryHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const summary = await getDashboardSummary(request.prisma);
    return reply.send(summary);
};

export const getInventoryAnalyticsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const stats = await getInventoryAnalytics(request.prisma);
    return reply.send(stats);
};

export const getSalesAnalyticsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const stats = await getSalesAnalytics(request.prisma);
    return reply.send(stats);
};

export const getSyncAnalyticsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const stats = await getSyncAnalytics(request.prisma);
    return reply.send(stats);
};
