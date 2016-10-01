const _ = require('underscore');
const match = require('../db/matches.js');

const MATCH_ID = 1;

var goofObj = {};
const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

module.exports = {
  newMatch: function (p1_id, p2_id) {
    // const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
    // shuffle the suits array
    var randSuits   = shuffle(suits);
    const p1_suit   = randSuits[0];
    const p2_suit   = randSuits[1];
    const deck_suit = randSuits[2];

    var newMatch =
    {
      game_id: 1,
      player1_id: p1_id,
      player2_id: p2_id,
      player1_score: 0,
      player2_score: 0,
      whose_move: 1,
      deck_cards:
      {
        spades:   [],
        hearts:   [],
        clubs:    [],
        diamonds: []
      },
      player1_cards:
      {
        spades: [],
        hearts: [],
        clubs: [],
        diamonds: []
      },
      player2_cards:
      {
        spades: [],
        hearts: [],
        clubs: [],
        diamonds: []
      },
      game_start: new Date
    }
    newMatch.deck_cards[deck_suit]  = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    newMatch.player1_cards[p1_suit] = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    newMatch.player2_cards[p2_suit] = [1,2,3,4,5,6,7,8,9,10,11,12,13];

    return newMatch;
  },

  move: function(oldState, p1bid , p2bid, prize) {
    // for testing

    var newState = oldState;

    // remove  cards from hand and deck
    newState.player1_cards   = remove(oldState.player1_cards, p1bid);
    newState.player2_cards   = remove(oldState.player2_cards, p2bid);
    newState.deck_cards      = remove(oldState.deck_cards, prize);

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
  }
};

function checkGameEnd(match){
  if(match.deck_cards){
    return match.deck_cards.length === 0;
  }
};

// module.exports = (knex) => {
//   //match(knex).getMatch(MATCH_ID, move);
//   match(knex).newMatch(newMatch)
// };


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

// Takes cards as an object with keys for every suit
function remove(cards, removal) {
  suits.forEach((suit) => {
    cards[suit] = _.without(cards[suit], removal);
  });
  return cards;
}



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
