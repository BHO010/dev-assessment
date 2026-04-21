import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const message = err.issues.map((e) => e.message).join(', ')
    res.status(400).json({ message })
    return
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }
  res.status(500).json({ message: 'Internal server error' })
}
