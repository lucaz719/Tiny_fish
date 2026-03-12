import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
    createProductHandler,
    createWarehouseHandler,
    getInventoryHandler,
    upsertInventoryHandler,
} from './inventory.controller.js';

const inventoryRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get('/', getInventoryHandler);
    app.post('/products', createProductHandler);
    app.post('/warehouses', createWarehouseHandler);
    app.post('/stock', upsertInventoryHandler);
};

export default inventoryRoutes;
