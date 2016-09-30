"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    res.cookie('user_id', req.params.id);
    res.redirect('/');
  });

  router.post("/", (req, res) => {
    res.cookie('user_id', req.body.id);
    res.redirect('/');
  });


  return router;
}
