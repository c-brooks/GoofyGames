"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    // TO-DO: Implement data from db for users
    let templateVars = { username: 'bigjohn77' };
    res.render("user_profile", templateVars);
  });

  return router;
}
