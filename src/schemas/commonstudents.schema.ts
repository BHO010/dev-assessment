import { z } from 'zod';

export const CommonStudentsQuerySchema = z.object({
  teacher: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string().email({ message: 'Invalid teacher email' })).min(1, { message: 'At least one teacher is required' }),
    )
    .openapi({ param: { style: 'form', explode: true } }),
});

export type CommonStudentsQuery = z.infer<typeof CommonStudentsQuerySchema>;
