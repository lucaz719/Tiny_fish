export async function complianceRoutes(fastify: any) {
  fastify.post('/batches', {
    handler: (await import('./compliance.controller.js')).registerBatchHandler,
    preHandler: [fastify.authenticate]
  });

  fastify.get('/batches/:productId', {
    handler: (await import('./compliance.controller.js')).getBatchesHandler,
    preHandler: [fastify.authenticate]
  });

  fastify.get('/batches/:batchId/trace', {
    handler: (await import('./compliance.controller.js')).traceBatchHandler,
    preHandler: [fastify.authenticate]
  });

  fastify.post('/licenses', {
    handler: (await import('./compliance.controller.js')).uploadLicenseHandler,
    preHandler: [fastify.authenticate]
  });

  fastify.get('/licenses', {
    handler: (await import('./compliance.controller.js')).getLicensesHandler,
    preHandler: [fastify.authenticate]
  });

  fastify.post('/recalls', {
    handler: (await import('./compliance.controller.js')).initiateRecallHandler,
    preHandler: [fastify.authenticate]
  });
}
