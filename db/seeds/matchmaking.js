
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('matchmaking').del()
    .then(function () {
      return Promise.all([
        // Reset id sequence to start at 1
        knex.schema.raw("select setval('matchmaking_id_seq',1)"),
        // Inserts seed entries
        knex('matchmaking').insert({player_id: 1, game_id: 1}),
        knex('matchmaking').insert({player_id: 2, game_id: 1})
      ]);
    });
};
