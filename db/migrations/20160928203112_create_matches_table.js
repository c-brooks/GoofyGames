exports.up = function(knex, Promise) {
  return knex.schema.createTable('matches', function (table) {
    table.increments();
    table.integer('game_id');
    table.integer('player1_id');
    table.integer('player2_id');
    table.integer('player1_score');
    table.integer('player2_score');
    table.integer('whose_move');
    table.text('deck_cards');
    table.text('player1_cards');
    table.text('player2_cards');
    table.dateTime('game_start');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('matches');
};
