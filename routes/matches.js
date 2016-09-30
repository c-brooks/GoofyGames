"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const matchesRepo = require('../db/matches.js')(knex);
  const matchmakingRepo = require('../db/matchmaking')(knex);
  const gamesRepo = require('../db/games.js')(knex);

  router.get("/", (req, res) => {
    matchesRepo.getAllMatches().then( (results) => {
      var templateVars = {results: results}
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
      var templateVars = {games: results[0], allMatches: results[1]}
      res.render("searchForNewMatch", templateVars);
    });
  });

// GET GAME PAGE
  router.get("/:id", (req, res) => {
    matchesRepo.getMatchByID(req.params.id)
    .then((match) => {
      let templateVars = { title: 'Match', matchData: match };
      res.render("game_table", templateVars);
    });
  });

// POST NEW
  router.post("/", (req, res) => {
    let userID = req.cookies.user_id;

    if(!userID){
      alert('Please login to play!');
      res.redirect('/');
    }

    matchmakingRepo.checkForChallenges(userID, 1).then( (challenge) => {

      if(!challenge){
        matchmakingRepo.new(userID,1);
        res.redirect('/matches');
      } else { // delete from challenge table, create new match in table
        matchmakingRepo.remove(userID);
        matchmakingRepo.remove(challenge.user_id);
        console.log(challenge);
      }
    });
  });

  return router;
}
