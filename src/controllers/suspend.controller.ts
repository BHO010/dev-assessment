import { NextFunction, Request, Response } from 'express'
import { SuspendBody } from '../schemas/suspend.schema'
import { suspendStudent } from '../services/suspend.service'

export async function suspend(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { student } = req.body as SuspendBody
    await suspendStudent(student)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
