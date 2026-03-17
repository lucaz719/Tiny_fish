import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
  getPriceBenchmarkHandler,
  createRfqHandler,
  getRfqsHandler,
  updateRfqStatusHandler,
  getReliabilityHandler
} from './intelligence.controller.js';

const intelligenceRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', authenticate);

  app.get('/benchmarks/:productId', getPriceBenchmarkHandler);
  app.get('/rfqs', getRfqsHandler);
  app.get('/reliability', getReliabilityHandler);
  const postRfqOptions = {
      schema: {
          body: {
              type: 'object',
              required: ['sellerId', 'productId', 'quantity'],
              properties: {
                  sellerId: { type: 'string', format: 'uuid' },
                  productId: { type: 'string', format: 'uuid' },
                  quantity: { type: 'integer', minimum: 1 }
              }
          }
      }
  };
  app.post('/rfqs', createRfqHandler);
  app.patch('/rfqs/:id/status', updateRfqStatusHandler);
};

export default intelligenceRoutes;
