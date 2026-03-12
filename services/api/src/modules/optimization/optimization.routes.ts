import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
    createPricingRuleHandler,
    createSettlementHandler,
    getForecastHandler,
    getPricingRulesHandler,
    getSettlementsHandler,
} from './optimization.controller.js';

const optimizationRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get('/pricing', getPricingRulesHandler);
    app.post('/pricing', createPricingRuleHandler);

    app.get('/settlements', getSettlementsHandler);
    app.post('/settlements', createSettlementHandler);

    app.get('/forecast/:productId', getForecastHandler);
};

export default optimizationRoutes;
