exports.up = function(knex, Promise) {
  return knex.schema.table('matches', function(table) {
    table.dropColumn('player1_last_turn');
    table.dropColumn('player2_last_turn');
  }).then(function() {
    return knex.schema.table('matches', function(table) {
      table.json('player1_last_turn').nullable().defaultTo(null);
      table.json('player2_last_turn').nullable().defaultTo(null);
    })
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('matches', function(table) {
    table.dropColumn('player1_last_turn');
    table.dropColumn('player2_last_turn');
  }).then(function() {
    return knex.schema.table('matches', function(table) {
      table.text('player1_last_turn').nullable().defaultTo(null);
      table.text('player2_last_turn').nullable().defaultTo(null);
    })
  });
};
