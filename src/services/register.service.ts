import { db } from '../db/knex'

export async function registerStudents(
  teacherEmail: string,
  studentEmails: string[],
): Promise<void> {
  const uniqueStudentEmails = [...new Set(studentEmails)]

  await db.transaction(async (trx) => {
    await trx('teachers').insert({ email: teacherEmail }).onConflict('email').ignore()
    const teacher = await trx('teachers').where({ email: teacherEmail }).first<{ id: number }>()

    await trx('students')
      .insert(uniqueStudentEmails.map((email) => ({ email })))
      .onConflict('email')
      .ignore()

    const students = await trx('students')
      .whereIn('email', uniqueStudentEmails)
      .select<{ id: number }[]>('id')

    await trx('teacher_students')
      .insert(students.map((s) => ({ teacher_id: teacher.id, student_id: s.id })))
      .onConflict(['teacher_id', 'student_id'])
      .ignore()
  })
}
