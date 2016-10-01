"use strict";
var matchesRepo = {};

module.exports = (knex) => {

  matchesRepo.getAllMatches = () => {
    return knex
      .select('*')
      .from('matches');
  };

    matchesRepo.getMatchesByPlayerID = (playerID) => {
    return knex
      .select('*')
      .from('matches')
      .where({player1_id: playerID})
      .orWhere({player2_id: playerID})
  };

  matchesRepo.newMatch = (gameObj) => {
    return knex('matches').returning('id').insert(gameObj);
  };

  matchesRepo.updateMatch = (matchID, currentState, move, moveParams) => {
// Numbers hardcoded for testing. should be passed in moveParams
    let newState = move(currentState, 1, 5, 12);
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
    let id = matchID;
    return knex
      .select('*')
      .from('matches')
      .where({id: id})
  };

  matchesRepo.getMyMatch = (userID, matchID) => {
    return knex
    .select('deck_cards', 'game_start')
    // Setup activePlayer
    // id
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_id WHEN player2_id = ${userID} THEN player2_id END AS activePlayer_id`))
    // cards
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_cards WHEN player2_id = ${userID} THEN player2_cards END AS activePlayer_cards`))
    //score
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_score WHEN player2_id = ${userID} THEN player2_score END AS activePlayer_score`))
    // last_turn
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_last_turn WHEN player2_id = ${userID} THEN player2_last_turn END AS activePlayer_last_turn`))

    // Setup opponent
    // id
    .select(knex.raw(`CASE WHEN player1_id != ${userID} THEN player1_id WHEN player2_id != ${userID} THEN player2_id END AS opponent_id`))
    // cards
    .select(knex.raw(`CASE WHEN player1_id != ${userID} THEN player1_cards WHEN player2_id != ${userID} THEN player2_cards END AS opponent_cards`))
    // score
    .select(knex.raw(`CASE WHEN player1_id != ${userID} THEN player1_score WHEN player2_id != ${userID} THEN player2_score END AS opponent_score`))
    // last_turn
    .select(knex.raw(`CASE WHEN player1_id != ${userID} THEN player1_last_turn WHEN player2_id != ${userID} THEN player2_last_turn END AS opponent_last_turn`))
    .from('matches')
    .where({ id: matchID })
  };

  matchesRepo.whichPlayer = (userID, matchID) => {
    return knex
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN 'player1' WHEN player2_id = ${userID} THEN 'player2' END AS player`))
    .from('matches')
    .where({ id: matchID });
  }

  matchesRepo.getOpponentID = (userID, matchID) => {
    return knex
    .select(knex.raw(`CASE WHEN player1_id != ${userID} THEN player1_id WHEN player2_id != ${userID} THEN player2_id END AS opponent_id`))
    .from('matches')
    .where({ id: matchID });
  }

  matchesRepo.getLastTurn = (userID, matchID) => {
    return knex
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_last_turn WHEN player2_id = ${userID} THEN player2_last_turn END AS player_last_turn`))
    .from('matches')
    .where({ id: matchID });
  };

  matchesRepo.getPlayerHand = (userID, matchID) => {
    return knex
    .select(knex.raw(`CASE WHEN player1_id = ${userID} THEN player1_cards WHEN player2_id = ${userID} THEN player2_cards END AS activePlayer_cards`))
    .from('matches')
    .where({ id: matchID });
  }

  matchesRepo.updatePlayer = (playerColumn, matchID, value) => {
    return knex('matches')
    .update(playerColumn, value)
    .where({ id: matchID });
  }

  return matchesRepo;
};
