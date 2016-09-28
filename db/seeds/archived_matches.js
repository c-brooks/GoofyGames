
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('archived_matches').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('archived_matches').insert({id: 1, match_id: 2, winner_id: 1, loser_id: 4, winner_score: 42, loser_score: 28, game_end: '2016-09-28 13:05:06'}),
        knex('archived_matches').insert({id: 1, match_id: 3, winner_id: 4, loser_id: 3, winner_score: 42, loser_score: 8, game_end: '2016-09-28 16:34:36'}),
        knex('archived_matches').insert({id: 1, match_id: 4, winner_id: 2, loser_id: 3, winner_score: 12, loser_score: 0, game_end: '2016-05-12 04:02:23'})
      ]);
    });
};
