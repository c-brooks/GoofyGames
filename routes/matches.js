"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const match = require('../db/matches.js')(knex);

router.get("/", (req, res) => {
  match.getAllMatches().then( (results) => {
    console.log(results)
    console.log(results[0].player1_id)
    var templateVars = {results: results}
    res.render("matches", templateVars)
  })
})

router.get("/:id", (req, res) => {
  Promise.all([
    match.getMatchByID(req.params.id)
  ]).then( (results) => {
    res.render("matches", {results: results})
  })
})


  return router;
}
