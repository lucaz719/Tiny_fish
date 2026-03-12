import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import { createOrderHandler, getOrdersHandler, updateOrderStatusHandler } from './order.controller.js';

const orderRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get('/', getOrdersHandler);
    app.post('/', createOrderHandler);
    app.patch('/:id/status', updateOrderStatusHandler);
};

export default orderRoutes;
