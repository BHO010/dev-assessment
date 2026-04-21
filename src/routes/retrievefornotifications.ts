import { Router } from 'express'
import { z } from 'zod'
import { retrieveForNotifications } from '../controllers/retrievefornotifications.controller'
import { validate } from '../middleware/validate'
import { registry } from '../openapi/registry'
import { RetrieveForNotificationsBodySchema } from '../schemas/retrievefornotifications.schema'

const router = Router()

registry.registerPath({
  method: 'post',
  path: '/retrievefornotifications',
  tags: ['Notifications'],
  request: {
    body: { content: { 'application/json': { schema: RetrieveForNotificationsBodySchema } } },
  },
  responses: {
    200: {
      description: 'List of students who can receive the notification',
      content: {
        'application/json': {
          schema: z.object({ recipients: z.array(z.string().email()) }),
        },
      },
    },
    400: { description: 'Validation error' },
  },
})

router.post('/', validate({ body: RetrieveForNotificationsBodySchema }), retrieveForNotifications)

export default router
