"use strict";

const express   = require('express');
const router    = express.Router();
const _         = require('underscore');

// Game logic
const goofspiel = require('../game-logic/goofspiel');
const blackjack = require ('../game-logic/blackjack');

module.exports = (knex) => {
  const matchesRepo     = require('../db/matches.js')(knex);
  const matchmakingRepo = require('../db/matchmaking')(knex);
  const gamesRepo       = require('../db/games.js')(knex);


  // Matches home page - display and look for matches
  router.get("/", (req, res) => {
    Promise.all([
      matchesRepo.getAllMatches(),
      matchesRepo.getMatchesByPlayerID(req.cookies['user_id']),
      gamesRepo.getAllGames(),
      matchmakingRepo.getUserChallenges(req.cookies['user_id'])
      ])
    .then( (results) => {
      var templateVars = {
        allMatches:   results[0],
        myMatches:    results[1],
        games:        results[2],
        myChallenges: results[3],
        my_id:      req.cookies['user_id']
      }
      res.render("matches", templateVars)
    });
  });

  // GET NEW PAGE
  router.get('/new', (req, res) => {
    Promise.all([
      gamesRepo.getAllGames(),
      matchesRepo.getAllMatches()
      ])
    .then( (results) => {
      var templateVars = {
        games: results[0],
        allMatches: results[1],
        my_id: req.cookies['user_id']
      }
      res.render("searchForNewMatch", templateVars);
    });
  });

// GET MATCH PAGE
router.get("/:id", (req, res) => {
  matchesRepo.getMyMatch(req.cookies.user_id, req.params.id)
  .then((match) => {
    let matchData = obfuscateMatchData(match[0]);
    let templateVars = {
      title: 'Match',
      matchData: matchData,
      my_id: req.cookies['user_id']
    };
    res.render("game_table", templateVars);
  });
});

  // POST NEW
  router.post("/", (req, res) => {
    var user_id = req.cookies.user_id;
    var game_id = req.body.game;

    if (!user_id) {
      res.redirect('/matches');
    }

    matchmakingRepo.checkForChallenges(user_id, game_id)
    .then( (challenge) => {
      console.log('\nChallenge:', challenge);

      if(challenge == undefined) {
        matchmakingRepo.new(user_id, game_id).then(() => {
        res.redirect('/matches');
        })
      } else if(challenge.player_id === user_id) {
        alert('Something went wrong. You cannot challenge yourself!');
        res.redirect('/matches');
      } else {
      if (challenge.game_id === 1){ // delete from challenge table, create new match in tablex
        let newMatch = goofspiel.newMatch(user_id, challenge.player_id);
      } else if(challenge.game_id === 2) {
        let newMatch = blackjack.newMatch(user_id, challenge.player_id);
      }
        Promise.all([
          matchmakingRepo.removeOneByUserID(user_id),
          matchmakingRepo.removeOneByUserID(challenge.player_id),
          matchesRepo.newMatch(newMatch);
          ])
        .then((results) => {
          //res.redirect(`/matches/${results[2]}`);
          res.redirect('/matches');
          });
      }
    });
  });

  // DELETE
  // TODO: make restful route (install method-override)
  router.post('/delete', (req, res) => {
    let match_id = req.body.match_id;
    matchesRepo.deleteMatchByID(match_id).then(() => {
      res.redirect('/matches');
    });
  })

  // Get last turn for player
  router.get("/:id/last_turn", (req, res) => {
    matchesRepo.getLastTurn(req.cookies.user_id,req.params.id)
    .then((turn) => {
      res.json(turn[0]);
    });
  });

  // Get last turn for opponent
  // TODO refactor this horrifically, disgusting mess
  router.get("/:id/opp_turn", (req, res) => {
    matchesRepo.getOpponentID(req.cookies.user_id, req.params.id)
    .then(opponent => {
      Promise.all([
        // Check last turn of both players (just to avoid cheating)
        // Active player last turn
        matchesRepo.getLastTurn(req.cookies.user_id, req.params.id),
        // Opponent last turn
        matchesRepo.getLastTurn(opponent[0].opponent_id, req.params.id)
      ]).then((turn) => {
        let activePlayer = turn[0][0];
        let opponent = turn[1][0];
        if (activePlayer.player_last_turn !== null && opponent.player_last_turn !== null) {
          matchesRepo.getMatchByID(req.params.id)
          .then((match) => {
            let oldState = match[0];
            let newState = goofspiel.move(oldState);
            matchesRepo.updateMatch(oldState, newState)
            .then((results) => {
              matchesRepo.getMyMatch(req.cookies.user_id, req.params.id)
              .then ((match) => {
                let matchData = obfuscateMatchData(match[0], opponent.player_last_turn);
                res.json(matchData);
              })
            });
          });
        } else {
          // Return opponent's turn
          res.json(opponent);
        }
      });
    });
  });

  // Post turn for player
  // TODO refactor this disgusting mess
  router.post("/:id/play_card", (req, res) => {
    Promise.all([
      matchesRepo.getPlayerHand(req.cookies.user_id, req.params.id),
      matchesRepo.whichPlayer(req.cookies.user_id, req.params.id)
    ]).then((results) => {
      let playerHand = results[0][0].activeplayer_cards;
      let player     = results[1][0].player;

      let cardValue = goofspiel.calcFaceValue(req.body.value);
      let cardToFind    = { suit: req.body.suit, value: cardValue.toString() };
      let findCard  = _.matcher(cardToFind);
      let cardFound = _.filter(playerHand, findCard);

      if (!_.isEmpty(cardFound)) {
        let cardSuit  = cardFound[0].suit;
        let cardValue = cardFound[0].value;
        let card      = JSON.stringify({ suit: cardSuit, value: cardValue });
        let newHand   = JSON.stringify(_.without(playerHand, cardFound[0]));

        Promise.all([
          // Update player's turn in db
          matchesRepo.updatePlayer(player + '_last_turn', req.params.id, card),
          // Remove card from player's hand
          matchesRepo.updatePlayer(player + '_cards', req.params.id, newHand)
        ]).then((result) => {
            // TODO handle errors
            res.sendStatus(200);
        });
      }
    });
  });

  function obfuscateMatchData(matchData, opponent_last_turn) {
    // Return first card from deck
    matchData.deck_cards = matchData.deck_cards[0];

    // Only return opponent card count, not value of cards
    matchData.opponent_cards = matchData.opponent_cards.length;

    // Return the opponent's last turn to display
    matchData.opponent_last_turn = opponent_last_turn;

    return matchData;
  }

  return router;
}
