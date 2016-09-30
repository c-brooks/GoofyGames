"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const matchesRepo = require('../db/matches.js')(knex);
  const matchmakingRepo = require('../db/matchmaking')(knex);
  const gamesRepo = require('../db/games.js')(knex);

  router.get("/", (req, res) => {
    matchesRepo.getAllMatches().then( (results) => {
      console.log(results)
      console.log(results[0].player1_id)
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
    matchesRepo.getMatchByID(req.params.id).then( (results) => {
      console.log(results)
      res.render("matches", {results: results})
    });
  });

// POST NEW
  router.post("/", (req, res) => {

console.log(Object.keys(req));
    matchmakingRepo.new(3,1);
    res.redirect('/matches');
  });

  return router;
}
