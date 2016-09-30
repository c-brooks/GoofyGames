"use strict";

const express = require('express');
const router  = express.Router();
const goofspiel = require('../game-logic/goofspiel');

module.exports = (knex) => {
  const matchesRepo = require('../db/matches.js')(knex);
  const matchmakingRepo = require('../db/matchmaking')(knex);
  const gamesRepo = require('../db/games.js')(knex);

  router.get("/", (req, res) => {
    matchesRepo.getAllMatches().then( (results) => {
      var templateVars = {results: results}
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
    var templateVars = {games: results[0], allMatches: results[1]}
    res.render("searchForNewMatch", templateVars);
  });
});

// GET GAME PAGE
router.get("/:id", (req, res) => {
  matchesRepo.getMatchByID(req.params.id).then( (results) => {
    res.render("matches", {results: results})
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
    console.log('CHALLENGE: ', challenge)
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
          //console.log("             ID: ", game_id)
        });
          console.log('Challenge posted!');
          //res.redirect('/matches');
        }
      });
    });
return router;
}