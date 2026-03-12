import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import { getMyTenantHandler, updateTenantHandler } from './tenant.controller.js';

const tenantRoutes = async (app: FastifyInstance) => {
    // All routes in this module require authentication
    app.addHook('preHandler', authenticate);

    app.get('/me', getMyTenantHandler);
    app.patch('/me', updateTenantHandler);
};

export default tenantRoutes;
