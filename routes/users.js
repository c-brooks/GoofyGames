"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const usersRepo = require('../db/users.js')(knex);
  const archivedMatchesRepo = require('../db/archived_matches.js')(knex);

  router.get("/:id", (req, res) => {
    usersRepo.getUser(req.params.id, function(user) {
      // archivedMatchesRepo.getArchivedMatches(req.params.id, function(archived_matches) {
      //   var archived_matches = archived_matches;
      // })
      let templateVars = { title: user.username, user: user, archived_matches: { one: 1, two: 2 } };
      res.render("profile", templateVars);
    });
  });

  return router;
}
