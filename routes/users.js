"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const usersRepo = require('../db/users.js')(knex);

  router.get("/:id", (req, res) => {
    usersRepo.getUser(req.params.id, function(user) {
      let templateVars = { user: user };
      // res.render("user_profile", templateVars);
    });
  });

  return router;
}
