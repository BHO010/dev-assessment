import { Router } from 'express'
import { commonStudents } from '../controllers/commonstudents.controller'
import { validate } from '../middleware/validate'
import { registry } from '../openapi/registry'
import { CommonStudentsQuerySchema } from '../schemas/commonstudents.schema'
import { z } from 'zod'

const router = Router()

registry.registerPath({
  method: 'get',
  path: '/commonstudents',
  tags: ['Students'],
  request: { query: CommonStudentsQuerySchema },
  responses: {
    200: {
      description: 'List of common students',
      content: {
        'application/json': {
          schema: z.object({ students: z.array(z.string().email()) }),
        },
      },
    },
    400: { description: 'Validation error' },
  },
})

router.get('/', validate({ query: CommonStudentsQuerySchema }), commonStudents)

export default router
