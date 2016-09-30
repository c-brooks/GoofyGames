"use strict";

const express = require('express');
const router  = express.Router();
const goofspiel = require('../game-logic/goofspiel');

module.exports = (knex) => {
  const matchesRepo = require('../db/matches.js')(knex);
  const matchmakingRepo = require('../db/matchmaking')(knex);
  const gamesRepo = require('../db/games.js')(knex);

// Matches home page - display and look for matches
router.get("/", (req, res) => {
  Promise.all([
    matchesRepo.getAllMatches(),
    matchesRepo.getMatchesByPlayerID(req.cookies['user_id']),
    gamesRepo.getAllGames(),
    matchmakingRepo.getUserChallenges(req.cookies['user_id'])
    ])
  .then( (results) => {
    var templateVars = {
      allMatches:   results[0],
      myMatches:    results[1],
      games:        results[2],
      myChallenges: results[3],
      my_id:      req.cookies['user_id']
    }
    res.render("matches", templateVars)
  });
});

// GET NEW PAGE
router.get('/new', (req, res) => {
  Promise.all([
    gamesRepo.getAllGames(),
    matchesRepo.getAllMatches()
    ])
  .then( (results) => {
    var templateVars = {
      games: results[0],
      allMatches: results[1],
      my_id: req.cookies['user_id']
    }
    res.render("searchForNewMatch", templateVars);
  });
});

// GET GAME PAGE
router.get("/:id", (req, res) => {
  matchesRepo.getMatchByID(req.params.id)
  .then((match) => {
    let matchData = buildMatchData(match[0],req.cookies['user_id']);
    let templateVars = {
      title: 'Match',
      matchData: matchData,
      my_id: req.cookies['user_id']
    };
    console.log(matchData);
    res.render("game_table", templateVars);
  });
});

  // POST NEW
  router.post("/", (req, res) => {
    let user_id = req.cookies.user_id;
    let game_id = req.body.game;

    if(!user_id){
      alert('Please login to play!');
      res.redirect('/matches');
    }

    matchmakingRepo.checkForChallenges(user_id, game_id).then( (challenge) => {
      if(!challenge) {
        matchmakingRepo.new(user_id, game_id);
        res.redirect('/matches');
      }
      if(challenge.player_id === user_id) {
        alert('You are already looking for a game!');
        res.redirect('/matches');
      } else { // delete from challenge table, create new match in table
        let newGame = goofspiel.newMatch(user_id, challenge.player_id);

        Promise.all([
          matchmakingRepo.removeOneByUserID(user_id),
          matchmakingRepo.removeOneByUserID(challenge.player_id),
          // NOTE: only supports Goofspiel right now
          matchesRepo.newMatch(goofspiel.newMatch(user_id, challenge.player_id))
          ]).then((results) => {
           //res.redirect(`/matches/${results[2]}`);  Go to
           res.redirect('/matches');
         });
          res.redirect('/matches');
        }
      });
  });

  // Get last turn for player
  router.get("/:id/last_turn", (req, res) => {
    matchesRepo.getLastTurn(req.cookies['user_id'],req.params.id)
    .then((turn) => {
      res.json(turn[0]);
    });
  });

  return router;
}












// TODO do all of this in SQL
function buildMatchData(match, activePlayerID) {
  if (match.player1_id === Number(activePlayerID)) {
    // Setup activePlayer = player1
    match.activePlayer_id = match.player1_id;
    match.activePlayer_cards = JSON.parse(match.player1_cards);
    match.activePlayer_score = match.player1_score;
    match.activePlayer_last_turn = match.player1_last_turn;

    // Setup opponent = player 2
    match.opponent_last_turn = match.player2_last_turn;
    match.opponent_score = match.player2_score;
    match.opponent_cards = countCards(match.player2_cards);
  } else if (match.player2_id === Number(activePlayerID)) {
    // Setup activePlayer = player2
    match.activePlayer_id = match.player2_id;
    match.activePlayer_cards = JSON.parse(match.player2_cards);
    match.activePlayer_score = match.player2_score;
    match.activePlayer_last_turn = match.player2_last_turn;

    // Setup opponent = player1
    match.opponent_last_turn = match.player1_last_turn;
    match.opponent_score = match.player1_score;
    match.opponent_cards = countCards(match.player1_cards);
  }

  // Delete redundant data that has been remapped
  delete match.player1_cards;
  delete match.player2_cards;
  delete match.player1_last_turn;
  delete match.player2_last_turn;
  delete match.player1_score;
  delete match.player2_score;

  // Return the top card of the deck
  match.deck_cards = JSON.parse(match.deck_cards);
  match.deck_cards = { spades: match.deck_cards.spades[0] };

  return match;
}

function countCards(cards) {
  let cardCount = 0;
  let cardsObj = JSON.parse(cards);
  for (var suit in cardsObj) {
    cardCount += cardsObj[suit].length;
  }
  return cardCount;
}
