exports.up = (knex) => {
  return knex.schema.createTable('book', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('ISBN').notNullable();
    table.date('dueDate');
    table.integer('user_id');
    table.boolean('checkedOut').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('book');
};
