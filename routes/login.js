"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    res.cookie('user_id', req.params.id);
    res.redirect('/');
  });

  return router;
}
