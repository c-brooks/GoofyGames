exports.up = function(knex, Promise) {
  return knex.schema.table('archived_matches', function (table) {
    table.dateTime('game_start');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('archived_matches', function (table) {
    table.dropColumn('game_start');
  });
};
