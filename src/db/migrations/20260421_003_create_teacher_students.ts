import { db } from '../knex'

export async function up(): Promise<void> {
  const exists = await db.schema.hasTable('teacher_students')
  if (!exists) {
    await db.schema.createTable('teacher_students', (table) => {
      table
        .integer('teacher_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('teachers')
        .onDelete('CASCADE')
      table
        .integer('student_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
      table.primary(['teacher_id', 'student_id'])
    })
  }
}

export async function down(): Promise<void> {
  await db.schema.dropTableIfExists('teacher_students')
}
