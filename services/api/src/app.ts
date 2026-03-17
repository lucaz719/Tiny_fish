import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import authRoutes from './modules/auth/auth.routes.js';
import tenantRoutes from './modules/tenant/tenant.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import syncRoutes from './modules/sync/sync.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import logisticsRoutes from './modules/logistics/logistics.routes.js';
import optimizationRoutes from './modules/optimization/optimization.routes.js';
import marketplaceRoutes from './modules/marketplace/marketplace.routes.js';
import ecosystemRoutes from './modules/ecosystem/ecosystem.routes.js';
import posRoutes from './modules/pos/pos.routes.js';
import intelligenceRoutes from './modules/intelligence/intelligence.routes.js';
import { complianceRoutes } from './modules/compliance/compliance.routes.js';
import prismaPlugin from './plugins/prisma.plugin.js';

const buildApp = (): FastifyInstance => {
    const app = fastify({
        logger: true,
    });

    // Register plugins
    app.register(cors, {
        origin: true, // Reflects the origin
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
    });
    app.register(jwt, {
        secret: process.env.JWT_SECRET || 'super-secret-key',
    });
    app.register(prismaPlugin);

    // Register routes
    app.register(authRoutes, { prefix: '/api/v1/auth' });
    app.register(tenantRoutes, { prefix: '/api/v1/tenants' });
    app.register(inventoryRoutes, { prefix: '/api/v1/inventory' });
    app.register(syncRoutes, { prefix: '/api/v1/sync' });
    app.register(orderRoutes, { prefix: '/api/v1/orders' });
    app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
    app.register(logisticsRoutes, { prefix: '/api/v1/logistics' });
    app.register(optimizationRoutes, { prefix: '/api/v1/optimization' });
    app.register(marketplaceRoutes, { prefix: '/api/v1/marketplace' });
    app.register(ecosystemRoutes, { prefix: '/api/v1/ecosystem' });
    app.register(posRoutes, { prefix: '/api/v1/pos' });
    app.register(intelligenceRoutes, { prefix: '/api/v1/intelligence' });
    app.register(complianceRoutes, { prefix: '/api/v1/compliance' });

    // Health check
    app.get('/health', async () => {
        return { status: 'healthy', timestamp: new Date().toISOString() };
    });

    return app;
};

export default buildApp;
