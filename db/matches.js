var matchesRepo = {};

module.exports = (knex) => {

// TODO: this should accept an object called moveParams
//        which tells the program which move to make.
  matchesRepo.updateMatch = (matchID, currentState, move) => {
//    console.log('Before move: ', currentState);

    var newState = move(currentState, 1, 5, 12);
//    console.log('After move: ', newState);
      knex.table('matches')
      .where({'id': 1})
      .update({
        deck_cards:    newState.deck_cards,
        player1_cards: newState.player1_cards,
        player2_cards: newState.player2_cards,
        player1_score: newState.player1_score,
        player2_score: 10000
      });
    };

// move(currentState, p1bid, p2bid, **prize**)
  matchesRepo.getMatch = (matchID, move) => {
    knex
    .select('*')
    .where({'id': matchID})
    .from('matches')
    .then((currentState) => {
      // TODO: This is pretty hacky
      currentState[0].player1_cards = JSON.parse(currentState[0].player1_cards);
      currentState[0].player2_cards = JSON.parse(currentState[0].player2_cards);
      currentState[0].deck_cards    = JSON.parse(currentState[0].deck_cards);
      matchesRepo.updateMatch(matchID, currentState[0], move);
   });
  };
return matchesRepo;
};
