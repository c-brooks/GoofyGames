
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('matches').del()
    .then(function () {
      return Promise.all([
        // Reset id sequence to start at 1
        knex.schema.raw("select setval('archived_matches_id_seq',1)"),
        // Inserts seed entries
        knex('matches').insert(
        {
          id: 1,
          game_id: 1,
          player1_id: 1,
          player2_id: 2,
          player1_score: 5,
          player2_score: 12,
          whose_move: 1,
          deck_cards:
          {
            spades:   [1,2,3,4,5,6,7,8,9,10,11,12,13],
            hearts:   [1,2,3,4,5,6,7,8,9,10,11,12,13],
            clubs:    [1,2,3,4,5,6,7,8,9,10,11,12,13],
            diamonds: [1,2,3,4,5,6,7,8,9,10,11,12,13]
          },
          player1_cards:
          {
            spades: [],
            hearts: [],
            clubs: [],
            diamonds: []
          },
          player2_cards:
          {
            spades: [],
            hearts: [],
            clubs: [],
            diamonds: []
          },
          game_start: '1999-01-08 04:05:06'
        })
      ]);
    });
};
