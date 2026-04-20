import { z } from 'zod';

export const SuspendBodySchema = z.object({
  student: z.string({
    required_error: 'student is required',
    invalid_type_error: 'student must be a string',
  }).email({ message: 'Invalid student email' }),
}).openapi('SuspendBody');

export type SuspendBody = z.infer<typeof SuspendBodySchema>;
