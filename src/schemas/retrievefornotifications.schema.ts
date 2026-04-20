import { z } from 'zod';

export const RetrieveForNotificationsBodySchema = z.object({
  teacher: z.string({
    required_error: 'teacher is required',
    invalid_type_error: 'teacher must be a string',
  }).email({ message: 'Invalid teacher email' }),
  notification: z.string({
    required_error: 'notification is required',
    invalid_type_error: 'notification must be a string',
  }).min(1, { message: 'Notification text is required' }),
}).openapi('RetrieveForNotificationsBody');

export type RetrieveForNotificationsBody = z.infer<typeof RetrieveForNotificationsBodySchema>;
