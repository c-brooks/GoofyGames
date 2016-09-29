"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const usersRepo = require('../db/users.js')(knex);
  const archivedMatchesRepo = require('../db/archived_matches.js')(knex);

  router.get("/:id", (req, res) => {
    usersRepo.getUser(req.params.id, function(user) {
      archivedMatchesRepo.getArchivedMatches(req.params.id, function(archivedMatches) {
        let templateVars = { title: user.username, user: user, archivedMatches: archivedMatches };
        res.render("profile", templateVars);
      })
    });
  });

  return router;
}
