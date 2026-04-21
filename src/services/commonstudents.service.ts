import db from '../db/knex'

export async function getCommonStudents(teacherEmails: string[]): Promise<string[]> {
  const uniqueEmails = [...new Set(teacherEmails)]
  const students = await db('students as s')
    .join('teacher_students as ts', 's.id', 'ts.student_id')
    .join('teachers as t', 'ts.teacher_id', 't.id')
    .whereIn('t.email', uniqueEmails)
    .groupBy('s.id', 's.email')
    .havingRaw('COUNT(DISTINCT t.id) = ?', [uniqueEmails.length])
    .select<{ email: string }[]>('s.email')

  return students.map((s) => s.email)
}
