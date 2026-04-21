import { z } from 'zod'

export const SuspendBodySchema = z
  .object({
    student: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? { message: 'student is required' }
            : { message: 'student must be a string' },
      })
      .email({ error: 'Invalid student email' }),
  })
  .openapi('SuspendBody')

export type SuspendBody = z.infer<typeof SuspendBodySchema>
