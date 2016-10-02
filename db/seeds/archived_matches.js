
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('archived_matches').del()
    .then(function () {
      return Promise.all([
        // Reset id sequence to start at 1
        knex.schema.raw("select setval('archived_matches_id_seq',1)"),
        // Inserts seed entries
        // knex('archived_matches').insert({id: 1, game_id: 1, winner_id: 1, loser_id: 4, winner_score: 42, loser_score: 28, game_start: '1999-01-08 04:05:06', game_end: '2016-09-28 13:05:06'}),
        // knex('archived_matches').insert({id: 2, game_id: 1, winner_id: 4, loser_id: 3, winner_score: 42, loser_score: 8, game_start: '2016-09-27 23:32:02', game_end: '2016-09-28 16:34:36'}),
        // knex('archived_matches').insert({id: 3, game_id: 1, winner_id: 2, loser_id: 3, winner_score: 12, loser_score: 0, game_start: '2016-05-12 01:00:45', game_end: '2016-05-12 04:02:23'})
      ]);
    });
};
