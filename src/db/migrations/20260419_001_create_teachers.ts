import db from '../knex';

export async function up(): Promise<void> {
  await db.schema.createTable('teachers', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
  });
}

export async function down(): Promise<void> {
  await db.schema.dropTable('teachers');
}
