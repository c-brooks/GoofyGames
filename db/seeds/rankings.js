
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('rankings').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('rankings').insert({id: 1, game_id: 1, player_id: 1, wins: 666, losses: 3}),
        knex('rankings').insert({id: 2, game_id: 1, player_id: 2, wins: 2, losses: 0}),
        knex('rankings').insert({id: 3, game_id: 1, player_id: 4, wins: 1, losses: 2334})
      ]);
    });
};
