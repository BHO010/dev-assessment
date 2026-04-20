import db from '../db/knex';
import { NotFoundError } from '../errors';

export async function suspendStudent(email: string): Promise<void> {
  const student = await db('students').where({ email }).first<{ id: number }>();
  if (!student) throw new NotFoundError(`Student ${email} not found`);

  await db('students').where({ email }).update({ suspended: true });
}
