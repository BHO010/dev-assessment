import { NextFunction, Request, Response } from 'express';
import { CommonStudentsQuery } from '../schemas/commonstudents.schema';
import { getCommonStudents } from '../services/commonstudents.service';

export async function commonStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { teacher } = req.query as unknown as CommonStudentsQuery;
    const students = await getCommonStudents(teacher);
    res.json({ students });
  } catch (err) {
    next(err);
  }
}
