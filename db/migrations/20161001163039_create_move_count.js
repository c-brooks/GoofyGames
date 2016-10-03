
exports.up = function(knex, Promise) {
  return knex.schema.table('matches', function (table) {
    table.text('move_count').defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('matches', function (table) {
    table.dropColumn('move_count');
  });
};
