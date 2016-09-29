"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const usersRepo = require('../db/users.js')(knex);
  const archivedMatchesRepo = require('../db/archived_matches.js')(knex);

  router.get("/:id", (req, res) => {
    usersRepo.getUser(req.params.id, function(user) {
      archivedMatchesRepo.getArchivedMatches(req.params.id, function(archived_matches) {
        var archived_matches = archived_matches;
      })

      let templateVars = { user: user, archived_matches: archived_matches };
      // res.render("user_profile", templateVars);
    });
  });

  return router;
}
