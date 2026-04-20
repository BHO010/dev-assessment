import { NextFunction, Request, Response } from 'express';
import { RegisterBody } from '../schemas/register.schema';
import { registerStudents } from '../services/register.service';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { teacher, students } = req.body as RegisterBody;
    await registerStudents(teacher, students);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
