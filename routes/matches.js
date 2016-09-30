"use strict";

const express = require('express');
const router  = express.Router();
const goofspiel = require('../game-logic/goofspiel');

module.exports = (knex) => {
  const matchesRepo = require('../db/matches.js')(knex);
  const matchmakingRepo = require('../db/matchmaking')(knex);
  const gamesRepo = require('../db/games.js')(knex);

// Get all games
router.get("/", (req, res) => {
  Promise.all([
    matchesRepo.getAllMatches(),
    matchesRepo.getMatchesByPlayerID(req.cookies['user_id'])
    ]).then( (results) => {
      var templateVars = {
        allMatches: results[0],
        myMatches:  results[1],
        my_id:      req.cookies['user_id']
      }
      res.render("matches", templateVars)
    });
  })

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

// GET MATCH PAGE
router.get("/:id", (req, res) => {
  matchesRepo.getMyMatch(req.cookies.user_id, req.params.id)
  .then((matchData) => {
    // Return first card from deck
    matchData[0].deck_cards = matchData[0].deck_cards[0];

    // Only return opponent card count, not value of cards
    matchData[0].opponent_cards = matchData[0].opponent_cards.length;

    let templateVars = {
      title: 'Match',
      matchData: matchData[0],
      my_id: req.cookies['user_id']
    };
    res.render("game_table", templateVars);
  });
});



  // POST NEW
  router.post("/", (req, res) => {
    let user_id = req.cookies.user_id;

    if(!user_id){
      alert('Please login to play!');
      res.redirect('/');
    }

    matchmakingRepo.checkForChallenges(user_id, 1).then( (challenge) => {
      // console.log('CHALLENGE: ', challenge)
      if(challenge.player_id === user_id) {
        alert('You are already looking for a game!');
        res.redirect('/matches');
      } else if(!challenge.player_id) {
        matchmakingRepo.new(user_id, 1);
        res.redirect('/matches');
      } else { // delete from challenge table, create new match in table
        let newGame = goofspiel.newMatch(user_id, challenge.player_id);

        Promise.all([
          matchmakingRepo.remove(user_id),
          matchmakingRepo.remove(challenge.player_id),
          matchesRepo.newMatch(goofspiel.newMatch(user_id, challenge.player_id))
          ]).then((results) => {
           res.redirect(`/matches/${results[2]}`);
         });
          console.log('Challenge posted!');
          //res.redirect('/matches');
        }
      });
  });

  // Get last turn for player
  router.get("/:id/last_turn", (req, res) => {
    matchesRepo.getLastTurn(req.cookies.user_id,req.params.id)
    .then((turn) => {
      res.json(turn[0]);
    });
  });

  // Post turn for player
  router.post("/:id/play_turn", (req, res) => {
    // TODO check that play is valid (card is in player's hand)
    matchesRepo.playCard(req.cookies.user_id,req.params.id)
    .then((turn) => {
      // TODO remove card from players hand
    });
  });

  return router;
}
