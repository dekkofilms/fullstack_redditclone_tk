
exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function (table) {
    table.string('title').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function (table) {
    table.dropColumn('title');
  });
};
