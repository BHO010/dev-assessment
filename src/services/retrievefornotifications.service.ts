import db from '../db/knex'

function parseMentionedEmails(notification: string): string[] {
  const matches = notification.matchAll(/@([\w.+-]+@[\w.-]+\.[a-zA-Z]{2,})/g)
  return [...new Set([...matches].map((m) => m[1]))]
}

export async function getRecipientsForNotification(
  teacherEmail: string,
  notification: string,
): Promise<string[]> {
  const mentionedEmails = parseMentionedEmails(notification)

  const [registeredStudents, mentionedStudents] = await Promise.all([
    db('students as s')
      .join('teacher_students as ts', 's.id', 'ts.student_id')
      .join('teachers as t', 'ts.teacher_id', 't.id')
      .where({ 't.email': teacherEmail, 's.suspended': false })
      .select<{ email: string }[]>('s.email'),

    mentionedEmails.length > 0
      ? db('students')
          .whereIn('email', mentionedEmails)
          .where({ suspended: false })
          .select<{ email: string }[]>('email')
      : Promise.resolve([]),
  ])

  const recipients = [
    ...new Set([
      ...registeredStudents.map((s) => s.email),
      ...mentionedStudents.map((s) => s.email),
    ]),
  ]

  return recipients
}
