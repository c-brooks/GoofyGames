exports.up = function(knex, Promise) {
  return knex.schema.table('rankings', function (table) {
    table.integer('losses');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('rankings', function (table) {
    table.dropColumn('losses');
  });
};
