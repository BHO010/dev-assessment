import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import express, { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { registry } from './registry'

import path from 'path';
const swaggerDistPath = path.join(__dirname, '../node_modules/swagger-ui-dist');

export function setupOpenApi(app: Express): void {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'API', version: '1.0.0' },
    servers: [{ url: '/api' }],
  })

  
  app.use('/api-docs', express.static(swaggerDistPath, { index: false }), swaggerUi.serve, swaggerUi.setup(document));

  //app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document))
  app.get('/api-docs.json', (_req, res) => res.json(document))
}
