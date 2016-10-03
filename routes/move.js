"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const match = require('../db/matches.js')(knex);

  router.post("/matches/id/move", (req, res) => {
    Promise.all([
      match.getMatchByID(req.params.id)
    ]).then( (results) => {
      currentState[0].player1_cards = JSON.parse(currentState[0].player1_cards);
      currentState[0].player2_cards = JSON.parse(currentState[0].player2_cards);
      currentState[0].deck_cards    = JSON.parse(currentState[0].deck_cards);
      matchesRepo.updateMatch(currentState[0]);

    });
  });

  return router;
}
