import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
  openSessionHandler,
  closeSessionHandler,
  createTransactionHandler,
  getSessionsHandler,
  getSessionTransactionsHandler
} from './pos.controller.js';

const posRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', authenticate);

  app.get('/sessions', getSessionsHandler);
  app.post('/sessions', openSessionHandler);
  app.patch('/sessions/:id/close', closeSessionHandler);
  app.get('/sessions/:sessionId/transactions', getSessionTransactionsHandler);
  app.post('/sessions/:sessionId/transactions', createTransactionHandler);
};

export default posRoutes;
