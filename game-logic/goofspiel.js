const _ = require('underscore');

module.exports = {

  game: {
    p1: { cards: [],
          score: 0,
          suit: '' },
    p2: { cards: [],
          score: 0,
          suit: ''
        },
    deck: { cards: [] }
  },

// Change to work with database eventually

/* Face cards represented as numbers for convienience
 * Jack - 11
 * Queen - 12
 * King - 13
 */

  initGame: function() {
    this.game.p1.cards   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.game.p1.score   = 0;
    this.game.p1.suit    = 'spades';
    this.game.p2.cards   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.game.p2.score   = 0;
    this.game.p2.suit    = 'hearts';
    this.game.deck.cards = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    this.game.deck.suit  = 'diamonds';
  },

  shuffle: function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  },

// Takes 'bids' (card played by players) and 'prize' (top card on deck) as parameters
// Note: on ties, the prize is discarded
  move: function (p1bid , p2bid, prize) {
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
  },

  checkGameEnd: function(){
    return this.game.deck.cards.length === 0;
  }
};