exports.up = function(knex, Promise) {
  return knex.schema.createTable('archived_matches', function (table) {
    table.increments();
    table.integer('match_id');
    table.integer('winner_id');
    table.integer('loser_id');
    table.integer('winner_score');
    table.integer('loser_score');
    table.dateTime('game_end');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('archived_matches');
};
