import { Router } from 'express';
import { register } from '../controllers/register.controller';
import { validate } from '../middleware/validate';
import { registry } from '../openapi/registry';
import { RegisterBodySchema } from '../schemas/register.schema';

const router = Router();

registry.registerPath({
  method: 'post',
  path: '/register',
  tags: ['Registration'],
  request: {
    body: { content: { 'application/json': { schema: RegisterBodySchema } } },
  },
  responses: {
    204: { description: 'Students registered successfully' },
    400: { description: 'Validation error' },
  },
});

router.post('/', validate({ body: RegisterBodySchema }), register);

export default router;
