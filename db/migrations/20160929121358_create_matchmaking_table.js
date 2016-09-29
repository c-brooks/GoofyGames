
exports.up = function(knex, Promise) {
  return knex.schema.createTable('matchmaking', function (table) {
    table.increments();
    table.integer('player_id');
    table.integer('game_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('matchmaking');
};
