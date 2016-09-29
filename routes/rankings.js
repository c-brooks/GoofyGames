"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const rankingsRepo = require('../db/rankings.js')(knex);
  const gamesRepo = require('../db/games.js')(knex);

  router.get("/", (req, res) => {

    Promise.all([
      gamesRepo.getAllGames(),
      // Get game with ID of 1 by default
      rankingsRepo.getGlobalRankings(1)
    ]).then(function(results) {
      console.log(results);
      let templateVars =
        {
          title: 'Rankings',
          games: results[0],
          rankings: results[1]
        };
      res.render("rankings", templateVars);
    });
  });

  return router;
}
