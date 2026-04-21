import { z } from 'zod'

export const CommonStudentsQuerySchema = z.object({
  teacher: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z
        .array(z.string().email({ error: 'Invalid teacher email' }))
        .min(1, { error: 'At least one teacher is required' }),
    )
    .openapi({ param: { style: 'form', explode: true }, example: ['teacherA@school.com', 'teacherB@school.com'] }),
})

export type CommonStudentsQuery = z.infer<typeof CommonStudentsQuerySchema>
