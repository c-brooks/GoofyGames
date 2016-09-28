exports.up = function(knex, Promise) {
  return knex.schema.createTable('rankings', function (table) {
    table.increments();
    table.integer('game_id');
    tabke.integer('player_id');
    table.integer('wins');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rankings');
};
