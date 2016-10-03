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
  const rankingsRepo    = require('../db/rankings.js')(knex);

  // Matches home page - display and look for matches
  router.get("/", (req, res) => {
    Promise.all([
      matchesRepo.getMatchesByPlayerID(req.cookies['user_id']),
      gamesRepo.getAllGames(),
      matchmakingRepo.getUserChallenges(req.cookies['user_id'])
      ])
    .then( (results) => {
      var templateVars = {
        myMatches:    results[0],
        games:        results[1],
        myChallenges: results[2],
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
    console.log('match[0]', match[0]);
    let matchData = obfuscateMatchData(match[0]);
    console.log('matchData', matchData);
    let templateVars = {
      title: 'Match',
      matchData: matchData,
      my_id: req.cookies['user_id']
    };
    if(match[0].game_id === 1){
      res.render("game_table", templateVars);
    } else if (match[0].game_id === 2){
      res.render("blackjack_game_table", templateVars);
    }
  });
});

  // POST NEW
  router.post("/", (req, res) => {
    var user_id = req.cookies.user_id;
    var game_id = req.body.game;

    if (!user_id) {
      res.redirect('/matches');
    }
    var newMatch;
    matchmakingRepo.checkForChallenges(user_id, game_id)

    .then( (challenge) => {
      if(challenge == undefined) {
        matchmakingRepo.new(user_id, game_id).then(() => {
        res.redirect('/matches');
        })
      } else if(challenge.player_id === user_id) {
        alert('Something went wrong. You cannot challenge yourself!');
        res.redirect('/matches');
      } else {
      if (challenge.game_id === 1){ // delete from challenge table, create new match in table
        newMatch = goofspiel.newMatch(user_id, challenge.player_id);
      } else if(challenge.game_id === 2) {
        newMatch = blackjack.newMatch(user_id, challenge.player_id);
      }
        Promise.all([
          matchmakingRepo.removeOneByUserID(user_id),
          matchmakingRepo.removeOneByUserID(challenge.player_id),
          matchesRepo.newMatch(newMatch)
          ])
        .then((results) => {
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
        // Make sure both player's moves have been made
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
            if(match.game_id == 1){
              let newState = goofspiel.move(oldState);
            } else if (match.game_id == 2) {
              let newState = blackjack.stand(oldState);
            }
            //if(oldState && newState) {
              matchesRepo.updateMatch(newState)
            .then((results) => {
              matchesRepo.getMyMatch(req.cookies.user_id, req.params.id)
              .then ((match) => {
                let matchData = obfuscateMatchData(match[0], opponent.player_last_turn);
                // Archive the match if it's over
                if (matchData.game_end) { archiveMatch(matchData); }
                  res.json(matchData);
                })
              });
            //} else res.json(oldState);
          });
        } else {
          // Return opponent's turn
          res.json({ opponent_last_turn: null });
        }
      });
    });
  });


// ---------------------------- MY BLACKJACK CODE ---------------------------- //
// ----------------------------  (MOSTLY STOLEN)  ---------------------------- //

  router.post('/:id/hit', (req, res) => {
    console.log(req.params, req.body);
    Promise.all([
      matchesRepo.getPlayerHand(req.cookies.user_id, req.params.id),
      matchesRepo.whichPlayer(req.cookies.user_id, req.params.id),
      matchesRepo.getMatchByID(req.params.id)
      ])
    .then( (results) => {
      let playerHand  = results[0][0].activeplayer_cards;
      let deck_cards  = results[2][0].deck_cards;
      deck_cards.shift();
      if(!playerHand) {
        playerHand    = [];
      }
      let player      = results[1][0].player;
      let cardValue   = goofspiel.calcFaceValue(req.body.value);
      let cardHit     = { suit: req.body.suit, value: cardValue.toString() };

      if (cardHit) {
        let cardSuit  = cardHit.suit;
        let cardValue = cardHit.value;
        let card      = JSON.stringify({ suit: cardSuit, value: cardValue });
        playerHand.push(cardHit);
        let newHand   = JSON.stringify(playerHand);

        Promise.all([
          // Update player's turn in db
          matchesRepo.updatePlayer(player + '_last_turn', req.params.id, card),
          // Remove card from player's hand
          matchesRepo.updatePlayer(player + '_cards', req.params.id, newHand)
        ]).then((result) => {
          let returnParams = {
            deck_cards: deck_cards,
            playerHand: newHand
          }
          res.json(returnParams);
        });
      }
    })
  })

  router.get('/:id/hit', (req, res) => {
    matchesRepo.getMatchByID(req.params.id)
    .then( (oldState) => {
      let newState = blackjack.hit(oldState)
      if(oldState && newState){
        matchesRepo.updateMatch(newState)
        .then( () => {
          console.log(newState);
          res.json(newState);
        })
      }
      //res.json(newState);
    })
  })

    router.post('/:id/stand', (req, res) => {
      matchesRepo.getMatchByID(req.params.id)
      .then( (results) => {
        let oldState  = results;
        var newState = blackjack.stand(oldState[0])

          matchesRepo.updateMatch(newState)
          .then((result) => {
            // TODO handle errors
            res.json(newState);
        });
      })
    })

    router.get('/:id/stand', (req, res) => {
      matchesRepo.getMatchByID(req.params.id)
      .then( (results) => {
        let oldState  = results;
        var newState = blackjack.stand(oldState[0])
        console.log(newState);
          matchesRepo.updateMatch(newState)
          .then((result) => {
            res.json(newState);
        });
      })
    })

// ------------------------------------------------------------------------------------- //

  // Post turn for player
  // TODO refactor this disgusting mess
  router.post("/:id/play_card", (req, res) => {
    Promise.all([
      matchesRepo.getPlayerHand(req.cookies.user_id, req.params.id),
      matchesRepo.whichPlayer(req.cookies.user_id, req.params.id)
    ]).then((results) => {
      let playerHand  = results[0][0].activeplayer_cards;
      let player      = results[1][0].player;

      let cardValue   = goofspiel.calcFaceValue(req.body.value);
      let cardToFind  = { suit: req.body.suit, value: cardValue.toString() };
      let findCard    = _.matcher(cardToFind);
      let cardFound   = _.filter(playerHand, findCard);

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
    if(matchData.game_id == 1){
      matchData.deck_cards = matchData.deck_cards[0];
    }
    // Only return opponent card count, not value of cards
    if(matchData.opponent_cards){
      matchData.opponent_cards = matchData.opponent_cards.length;
    }

    // Return the opponent's last turn to display
    matchData.opponent_last_turn = opponent_last_turn;

    return matchData;
  };

  function archiveMatch(matchData) {
    console.log('archiving...');
    let archiveData             = {};
    archiveData.match_id        = matchData.id;
    archiveData.game_id         = matchData.game_id;
    archiveData.game_start      = matchData.game_start;
    archiveData.game_end        = matchData.game_end;

    if (matchData.activeplayer_score > matchData.opponent_score) {
      archiveData.winner_id     = matchData.activeplayer_id;
      archiveData.winner_score  = matchData.activeplayer_score;

      archiveData.loser_id      = matchData.opponent_id;
      archiveData.loser_score   = matchData.opponent_score;
    } else {
      archiveData.winner_id     = matchData.opponent_id;
      archiveData.winner_score  = matchData.opponent_score;

      archiveData.loser_id      = matchData.activeplayer_id;
      archiveData.loser_score   = matchData.activeplayer_score;
    }

    // This gets called by both players when the match ends and produces
    // a lot of big, red, ugly text in the console... sorry!
    matchesRepo.archiveMatch(archiveData)
    .then((players) => {
      // TODO actually delete matches once BOTH players have seen results
      // matchesRepo.deleteMatchByID(matchData.id)
      rankingsRepo.addWin(players[0].winner_id),
      rankingsRepo.addLoss(players[0].loser_id)
    })
  };

  return router;
}
