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

  app.get('/api-docs', (_req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>API Docs</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
      })
    </script>
  </body>
</html>`)
  })
  app.get('/api-docs.json', (_req, res) => res.json(document))
}
