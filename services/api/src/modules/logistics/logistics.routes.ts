import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
    assignDriverHandler,
    createDriverHandler,
    createShipmentHandler,
    getDriversHandler,
    getShipmentsHandler,
    updateShipmentStatusHandler,
} from './logistics.controller.js';

const logisticsRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get('/shipments', getShipmentsHandler);
    app.get('/drivers', getDriversHandler);

    app.post('/drivers', createDriverHandler);
    app.post('/shipments', createShipmentHandler);
    app.patch('/shipments/:id/assign', assignDriverHandler);
    app.patch('/shipments/:id/status', updateShipmentStatusHandler);
};

export default logisticsRoutes;
