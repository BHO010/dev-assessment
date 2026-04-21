import { Router } from 'express'
import db from '../db/knex'
import { registry } from '../openapi/registry'

const router = Router()

registry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: {
      description: 'Service is healthy',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
            },
          },
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/health/db',
  tags: ['Health'],
  responses: {
    200: {
      description: 'Database is healthy',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
              database: { type: 'string', example: 'ok' },
            },
          },
        },
      },
    },
    503: {
      description: 'Database is unreachable',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'error' },
              database: { type: 'string', example: 'unreachable' },
            },
          },
        },
      },
    },
  },
})

router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

router.get('/db', async (_req, res) => {
  try {
    await db.raw('SELECT 1')
    res.status(200).json({ status: 'ok', database: 'ok' })
  } catch {
    res.status(503).json({ status: 'error', database: 'unreachable' })
  }
})

export default router
