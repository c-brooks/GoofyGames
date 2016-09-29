"use strict";

const express = require('express');
const _ = require('underscore');
const router  = express.Router();

module.exports = (knex) => {
  const usersRepo = require('../db/users.js')(knex);
  const archivedMatchesRepo = require('../db/archived_matches.js')(knex);
  const rankingsRepo = require('../db/rankings.js')(knex);

  router.get("/:id", (req, res) => {
    Promise.all([
      usersRepo.getUser(req.params.id),
      archivedMatchesRepo.getArchivedMatches(req.params.id),
      rankingsRepo.getUserRankings(req.params.id)
    ]).then(function(results) {
      let user = results[0][0];
      let archivedMatches = results[1];
      let rankings = results[2];

      let templateVars =
      {
        title: user.username,
        user: user,
        rankings: rankings,
        archivedMatches: archivedMatches
      };

      res.render("profile", templateVars);
    });
  });

  return router;
}
