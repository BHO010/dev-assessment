import db from '../knex'

export async function up(): Promise<void> {
  await db.schema.table('students', (table) => {
    table.boolean('suspended').notNullable().defaultTo(false)
  })
}

export async function down(): Promise<void> {
  await db.schema.table('students', (table) => {
    table.dropColumn('suspended')
  })
}
