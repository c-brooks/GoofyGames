"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/');
  });

  return router;
}
