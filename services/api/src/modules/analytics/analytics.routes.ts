import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
    getDashboardSummaryHandler,
    getInventoryAnalyticsHandler,
    getSalesAnalyticsHandler,
    getSyncAnalyticsHandler,
} from './analytics.controller.js';

const analyticsRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get('/dashboard', getDashboardSummaryHandler);
    app.get('/inventory', getInventoryAnalyticsHandler);
    app.get('/sales', getSalesAnalyticsHandler);
    app.get('/sync', getSyncAnalyticsHandler);
};

export default analyticsRoutes;
