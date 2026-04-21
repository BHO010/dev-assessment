import { z } from 'zod'

export const RetrieveForNotificationsBodySchema = z
  .object({
    teacher: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? { message: 'teacher is required' }
            : { message: 'teacher must be a string' },
      })
      .email({ error: 'Invalid teacher email' }),
    notification: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? { message: 'notification is required' }
            : { message: 'notification must be a string' },
      })
      .min(1, { error: 'Notification text is required' }),
  })
  .openapi('RetrieveForNotificationsBody')

export type RetrieveForNotificationsBody = z.infer<typeof RetrieveForNotificationsBodySchema>
