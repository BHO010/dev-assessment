import { z } from 'zod';

export const RegisterBodySchema = z.object({
  teacher: z.string({
    required_error: 'teacher is required',
    invalid_type_error: 'teacher must be a string',
  }).email({ message: 'Invalid teacher email' }),
  students: z
    .array(z.string().email({ message: 'Invalid student email' }), {
      required_error: 'students is required',
      invalid_type_error: 'students must be an array of emails',
    })
    .min(1, { message: 'At least one student is required' }),
}).openapi('RegisterBody');

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
