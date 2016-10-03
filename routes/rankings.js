"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const rankingsRepo = require('../db/rankings.js')(knex);
  const gamesRepo = require('../db/games.js')(knex);

  router.get('/', (req, res) => {

    Promise.all([
      gamesRepo.getAllGames(),
      // Get game with ID of 1 by default
      rankingsRepo.getGlobalRankings(1)
    ]).then(function(results) {
      let templateVars =
        {
          title: 'Rankings',
          my_id: req.cookies.user_id,
          games: results[0],
          rankings: results[1]
        };
      res.render("rankings", templateVars);
    });
  });

  router.get('/:id', (req, res) => {
    rankingsRepo.getGlobalRankings(req.params.id)
    .then(function(results) {
      res.json(results);
    });
  });

  return router;
}
