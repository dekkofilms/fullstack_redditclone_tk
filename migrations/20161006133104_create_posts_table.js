
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('posts', function (table) {
    table.increments();
    table.string('content').notNullable();
    table.string('link').notNullable();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts');
};
