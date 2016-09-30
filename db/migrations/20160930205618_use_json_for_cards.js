exports.up = function(knex, Promise) {
  return knex.schema.table('matches', function(table) {
    table.dropColumn('deck_cards');
    table.dropColumn('player1_cards');
    table.dropColumn('player2_cards');
  }).then(function() {
    return knex.schema.table('matches', function(table) {
      table.json('deck_cards');
      table.json('player1_cards');
      table.json('player2_cards');
    })
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('matches', function(table) {
    table.dropColumn('deck_cards');
    table.dropColumn('player1_cards');
    table.dropColumn('player2_cards');
  }).then(function() {
    return knex.schema.table('matches', function(table) {
      table.text('deck_cards');
      table.text('player1_cards');
      table.text('player2_cards');
    })
  });
};
