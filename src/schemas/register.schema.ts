import { z } from 'zod'

export const RegisterBodySchema = z
  .object({
    teacher: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? { message: 'teacher is required' }
            : { message: 'teacher must be a string' },
      })
      .email({ error: 'Invalid teacher email' }),
    students: z
      .array(z.string().email({ error: 'Invalid student email' }), {
        error: (issue) =>
          issue.input === undefined
            ? { message: 'students is required' }
            : { message: 'students must be an array of emails' },
      })
      .min(1, { error: 'At least one student is required' }),
  })
  .openapi('RegisterBody', {
    example: {
      teacher: "teacherA@school.com",
      students: [
        "studentA@school.com",
        "studentB@school.com"
      ]
    }
  })

export type RegisterBody = z.infer<typeof RegisterBodySchema>
