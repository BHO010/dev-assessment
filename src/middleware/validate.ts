import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

interface ValidateSchemas {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}

export function validate(schemas: ValidateSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body)
      if (!result.success) return void next(result.error)
      req.body = result.data
    }
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query)
      if (!result.success) return void next(result.error)
      Object.assign(req.query, result.data)
    }
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params)
      if (!result.success) return void next(result.error)
      Object.assign(req.params, result.data)
    }
    next()
  }
}
