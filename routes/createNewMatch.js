"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const match = require('../db/matches.js')(knex);

router.get("/", (req, res) => {
    res.render("createNewMatch", templateVars);
  });


router.post("/:id", (req, res) => {
    Promise.all([
      match.getMatchByID(req.params.id)
    ]).then( (results) => {
      console.log(results)
      res.render("matches", {results: results})
    })
  });

  router.get("/:id", (req, res) => {
    Promise.all([
      match.getMatchByID(req.params.id)
    ]).then( (results) => {
      console.log(results)
      res.render("matches", {results: results})
    })
  });

  return router;
};