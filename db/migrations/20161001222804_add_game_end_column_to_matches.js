exports.up = function(knex, Promise) {
  return knex.schema.table('matches', function(table) {
    table.dateTime('game_end');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('matches', function(table) {
    table.dropColumn('game_end');
  });
};
