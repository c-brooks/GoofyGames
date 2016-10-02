"use strict";
var matchesRepo = {};

module.exports = (knex) => {
  matchesRepo.getAllMatches = () => {
    return knex
      .select('*')
      .from('matches');
  };

  matchesRepo.deleteMatchByID = (matchID) => {

     return knex('matches')
      .del()
      .where({
        id: matchID
      }).then( () => {
        console.log();
      });
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

  matchesRepo.updateMatch = (oldState, newState) => {
    return knex.table('matches')
    .where({ id: oldState.id })
    .update({
      deck_cards:    JSON.stringify(newState.deck_cards),
      player1_cards: JSON.stringify(newState.player1_cards),
      player2_cards: JSON.stringify(newState.player2_cards),
      player1_score: newState.player1_score,
      player2_score: newState.player2_score,
      player1_last_turn: null,
      player2_last_turn: null,
      game_end: newState.game_end || null
    });
  };

  matchesRepo.getMatchByID = (matchID) => {
    return knex
      .select('*')
      .from('matches')
      .where({ id: matchID })
  };

  matchesRepo.getMyMatch = (userID, matchID) => {
    return knex
<<<<<<< Updated upstream
    .select('id', 'deck_cards', 'game_start', 'game_end', 'game_id')
=======
    .select('deck_cards', 'game_start', 'game_id')
>>>>>>> Stashed changes
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

  // TODO move this to archived_matches.js
  matchesRepo.archiveMatch = (matchData) => {
    return knex('archived_matches')
    .insert(matchData)
    .returning(['match_id', 'winner_id', 'loser_id']);
  }

  return matchesRepo;
};
