import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import { triggerSyncHandler } from './sync.controller.js';

const syncRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.post('/trigger', triggerSyncHandler);
};

export default syncRoutes;
