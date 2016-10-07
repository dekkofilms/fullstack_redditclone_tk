
exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function (table) {
    table.string('img_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function (table) {
    table.dropColumn('img_url');
  });
};
