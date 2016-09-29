const _ = require('underscore');
const match = require('../db/matches.js');

const MATCH_ID = 1;

var goofObj = {};


function move(oldState, p1bid , p2bid, prize) {
  // for testing
  var newState = {
          id: 1,
          game_id: oldState.game_id,
          player1_id: oldState.player1_id,
          player2_id: oldState.player2_id,
          player1_score: oldState.player1_score,
          player2_score: oldState.player2_score,
          whose_move: 1,
          deck_cards:
          {
            spades:   [1,2,3,4,5,6,7,8,9,10,11,12,13],
            hearts:   [1,2,3,4,5,6,7,8,9,10,11,12,13],
            clubs:    [1,2,3,4,5,6,7,8,9,10,11,12,13],
            diamonds: [1,2,3,4,5,6,7,8,9,10,11,12,13]
          },
          player1_cards:
          {
            spades: [1,2,3,4,5,6,7,8,9,10,11,12,13],
            hearts: [],
            clubs: [],
            diamonds: []
          },
          player2_cards:
          {
            spades: [],
            hearts: [],
            clubs: [],
            diamonds: [1,2,3,4,5,6,7,8,9,10,11,12,13]
          }
  };

  // remove  cards from hand and deck
  newState.player1_cards.spades   = _.without(oldState.player1_cards.spades, p1bid);
  newState.player2_cards.diamonds = _.without(oldState.player2_cards.diamonds, p2bid);
  newState.deck_cards.hearts      = _.without(oldState.deck_cards.hearts, prize);

  // Winner gets the value of prize
  if(p1bid  > p2bid ) {
    newState.player1_score = oldState.player1_score + prize;
  } else if (p2bid  > p1bid ) {
    newState.player2_score = oldState.player2_score + prize;
  }
  if(checkGameEnd(oldState)){
    console.log('Game End!'); // Do game-end logic
  }
  return newState;
};

function checkGameEnd(match){
  if(match.deck_cards){
    return match.deck_cards.length === 0;
  }
};

module.exports = (knex) => {
  match(knex).getMatch(MATCH_ID, move);
};




/*
function() {
    obj.p1.cards   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    obj.p1.score   = 0;
    obj.p1.suit    = 'spades';
    obj.p2.cards   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    obj.p2.score   = 0;
    obj.p2.suit    = 'hearts';
    //obj.game.deck.cards = obj.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    //obj.game.deck.suit  = 'diamonds';
  }

/*


console.log(obj)

// to test
// goofObj.game = game(knex, 1);
// console.log('GAME ', game(knex, 1))


/* Face cards represented as numbers for convienience
 * Jack - 11
 * Queen - 12
 * King - 13
 */
/*
  goofObj.initGame = function() {
    this.game.p1.cards   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.game.p1.score   = 0;
    this.game.p1.suit    = 'spades';
    this.game.p2.cards   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.game.p2.score   = 0;
    this.game.p2.suit    = 'hearts';
    this.game.deck.cards = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    this.game.deck.suit  = 'diamonds';
  };

  // Shuffles array of cards randomly
  function shuffle (cards) {
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }
    return cards;
  };

// Takes 'bids' (card played by players) and 'prize' (top card on deck) as parameters
// Note: on ties, the prize is discarded
  function move (p1bid , p2bid, prize) {
    // remove  cards from hand and deck
    this.game.p1.cards = _.without(this.game.p1.cards, p1bid);
    this.game.p2.cards = _.without(this.game.p2.cards, p2bid);
    this.game.deck.cards = _.without(this.game.deck.cards, prize);
    // Winner gets the value of prize
    if(p1bid  > p2bid ) {
      this.game.p1.score += prize;
    } else if (p2bid  > p1bid ) {
      this.game.p2.score += prize;
    }
    if(this.checkGameEnd()){
      console.log('Game End!'); // Do some logic
    }
  };

*/