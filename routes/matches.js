"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const matchesRepo = require('../db/matches.js')(knex);

  router.get('/:id', (req, res) => {
    var match = {
          id: 1,
          game_id: 1,
          activePlayer_id: 1,
          opponent_id: 2,
          activePlayer_score: 5,
          opponent_score: 12,
          whose_move: 1,
          deck_cards:
          {
            spades:   [1,2,3,4,5,6,7,8,9,10,11,12,13],
            hearts:   [1,2,3,4,5,6,7,8,9,10,11,12,13],
            clubs:    [1,2,3,4,5,6,7,8,9,10,11,12,13],
            diamonds: [1,2,3,4,5,6,7,8,9,10,11,12,13]
          },
          activePlayer_cards:
          {
            spades: [1,2,3,4,5],
            hearts: [6,7,8,9,10],
            clubs: [4,6],
            diamonds: [11]
          },
          opponent_cards:
          {
            spades: [6,5,4,3,1],
            hearts: [],
            clubs: [],
            diamonds: []
          },
          game_start: '1999-01-08 04:05:06'
        };
    // matchesRepo.getMatch(req.params.id)
    // .then(function(match) {
      let templateVars = { title: 'Match', matchData: match };
      res.render("game_table", templateVars);
    // });
  });

  return router;
}
