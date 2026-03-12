import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
    getVendorProfileHandler,
    searchMarketplaceHandler,
    submitReviewHandler,
} from './marketplace.controller.js';

const marketplaceRoutes = async (app: FastifyInstance) => {
    app.get('/search', { preHandler: [authenticate] }, searchMarketplaceHandler as any);
    app.get('/vendor/:id', { preHandler: [authenticate] }, getVendorProfileHandler as any);
    app.post('/review', { preHandler: [authenticate] }, submitReviewHandler as any);
};

export default marketplaceRoutes;
