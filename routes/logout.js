"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/urls');
  });

  return router;
}
