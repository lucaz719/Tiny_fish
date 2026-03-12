import { FastifyReply, FastifyRequest } from 'fastify';
import {
    createPricingRule,
    createSettlement,
    getInventoryForecast,
    getPricingRules,
    getSettlements,
} from './optimization.service.js';
import { CreatePricingRuleInput, CreateSettlementInput } from './optimization.schema.js';

export const createPricingRuleHandler = async (
    request: FastifyRequest<{ Body: CreatePricingRuleInput }>,
    reply: FastifyReply
) => {
    const rule = await createPricingRule(request.prisma, request.user.tenantId, request.body);
    return reply.code(201).send(rule);
};

export const getPricingRulesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const rules = await getPricingRules(request.prisma);
    return reply.send(rules);
};

export const createSettlementHandler = async (
    request: FastifyRequest<{ Body: CreateSettlementInput }>,
    reply: FastifyReply
) => {
    const settlement = await createSettlement(request.prisma, request.user.tenantId, request.body);
    return reply.code(201).send(settlement);
};

export const getSettlementsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const settlements = await getSettlements(request.prisma);
    return reply.send(settlements);
};

export const getForecastHandler = async (
    request: FastifyRequest<{ Params: { productId: string } }>,
    reply: FastifyReply
) => {
    const forecast = await getInventoryForecast(request.prisma, request.params.productId);
    return reply.send(forecast);
};
