
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
            { suit: 'heart', value: '1' },
            { suit: 'heart', value: '2' },
            { suit: 'heart', value: '3' },
            { suit: 'heart', value: '4' },
            { suit: 'heart', value: '5' },
            { suit: 'heart', value: '6' },
            { suit: 'heart', value: '7' },
            { suit: 'heart', value: '8' },
            { suit: 'heart', value: '9' },
            { suit: 'heart', value: '10' },
            { suit: 'heart', value: '11' },
            { suit: 'heart', value: '12' },
            { suit: 'heart', value: '13' },
            { suit: 'club', value: '1' },
            { suit: 'club', value: '2' },
            { suit: 'club', value: '3' },
            { suit: 'club', value: '4' },
            { suit: 'club', value: '5' },
            { suit: 'club', value: '6' },
            { suit: 'club', value: '7' },
            { suit: 'club', value: '8' },
            { suit: 'club', value: '9' },
            { suit: 'club', value: '10' },
            { suit: 'club', value: '11' },
            { suit: 'club', value: '12' },
            { suit: 'club', value: '13' }
          },
          player1_cards:
          {
            { suit: 'spade', value: '1' },
            { suit: 'spade', value: '2' },
            { suit: 'spade', value: '3' },
            { suit: 'spade', value: '4' },
            { suit: 'spade', value: '5' },
            { suit: 'spade', value: '6' },
            { suit: 'spade', value: '7' },
            { suit: 'spade', value: '8' },
            { suit: 'spade', value: '9' },
            { suit: 'spade', value: '10' },
            { suit: 'spade', value: '11' },
            { suit: 'spade', value: '12' },
            { suit: 'spade', value: '13' }
          },
          player2_cards:
          {
            { suit: 'diamond', value: '1' },
            { suit: 'diamond', value: '2' },
            { suit: 'diamond', value: '3' },
            { suit: 'diamond', value: '4' },
            { suit: 'diamond', value: '5' },
            { suit: 'diamond', value: '6' },
            { suit: 'diamond', value: '7' },
            { suit: 'diamond', value: '8' },
            { suit: 'diamond', value: '9' },
            { suit: 'diamond', value: '10' },
            { suit: 'diamond', value: '11' },
            { suit: 'diamond', value: '12' },
            { suit: 'diamond', value: '13' }
          },
          game_start: '1999-01-08 04:05:06'
        })
      ]);
    });
};
