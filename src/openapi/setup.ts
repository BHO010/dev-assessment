import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { registry } from './registry'

export function setupOpenApi(app: Express): void {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'API', version: '1.0.0' },
    servers: [{ url: '/api' }],
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document))
  app.get('/api-docs.json', (_req, res) => res.json(document))
}
