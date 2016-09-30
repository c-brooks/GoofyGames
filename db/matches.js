var matchesRepo = {};

module.exports = (knex) => {

  matchesRepo.getAllMatches = () => {
    return knex
      .select('*')
      .from('matches');
  };

  matchesRepo.newMatch = (gameObj) => {
    return knex('matches').returning('id').insert(gameObj);
  };

  matchesRepo.updateMatch = (matchID, currentState, move, moveParams) => {

    var newState = move(currentState, 1, 5, 12);
      knex.table('matches')
      .where({'id': 1})
      .update({
        deck_cards:    newState.deck_cards,
        player1_cards: newState.player1_cards,
        player2_cards: newState.player2_cards,
        player1_score: newState.player1_score,
        player2_score: newState.player2_score
      })
    };

  matchesRepo.getMatchByID = (matchID) => {
    var id = matchID;
    return knex
      .select('*')
      .from('matches')
      .where({id: id})
  };

  matchesRepo.getLastTurn = (userID, matchID) => {
    return knex
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_last_turn WHEN player2_id = ${userID} THEN player2_last_turn END AS activePlayer_last_turn`))
    .select(knex.raw(`CASE WHEN player1_id != ${userID} THEN player1_last_turn WHEN player2_id != ${userID} THEN player2_last_turn END AS opponent_last_turn`))
    .from('matches')
    .where({ id: matchID });
  };

  return matchesRepo;
};
