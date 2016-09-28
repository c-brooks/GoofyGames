exports.up = function(knex, Promise) {
  return knex.schema.table('archived_matches', function (table) {
    table.renameColumn('match_id','game_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('archived_matches', function (table) {
    table.renameColumn('game_id','match_id');
  });
};
