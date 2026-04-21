import { Router } from 'express'
import { suspend } from '../controllers/suspend.controller'
import { validate } from '../middleware/validate'
import { registry } from '../openapi/registry'
import { SuspendBodySchema } from '../schemas/suspend.schema'

const router = Router()

registry.registerPath({
  method: 'post',
  path: '/suspend',
  tags: ['Students'],
  request: {
    body: { content: { 'application/json': { schema: SuspendBodySchema } } },
  },
  responses: {
    204: { description: 'Student suspended successfully' },
    400: { description: 'Validation error' },
    404: { description: 'Student not found' },
  },
})

router.post('/', validate({ body: SuspendBodySchema }), suspend)

export default router
