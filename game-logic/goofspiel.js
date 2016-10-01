"use strict"
const _ = require('underscore');
const match = require('../db/matches.js');

const MATCH_ID = 1;

const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

module.exports = {
  newMatch: function (p1_id, p2_id) {
    // const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
    // shuffle the suits array
    const randSuits = shuffle(suits);
    const p1_suit   = randSuits[0];
    const p2_suit   = randSuits[1];
    const deck_suit = randSuits[2];

    let deck_cards  = JSON.stringify(shuffle(getCards(deck_suit)));
    let p1_cards    = JSON.stringify(getCards(p1_suit));
    let p2_cards    = JSON.stringify(getCards(p2_suit));

    let newMatch =
    {
      game_id: 1,
      player1_id: p1_id,
      player2_id: p2_id,
      player1_score: 0,
      player2_score: 0,
      player1_last_turn: null,
      player2_last_turn: null,
      deck_cards: deck_cards,
      player1_cards: p1_cards,
      player2_cards: p2_cards,

      game_start: new Date
    }

    return newMatch;
  },

  move: function(oldState) {
    // Setup required variables from old state
    var newState = oldState;
    var p1bid = calcFaceValue(oldState.player1_last_turn.value);
    var p2bid = calcFaceValue(oldState.player2_last_turn.value);
    var prize = oldState.deck_cards[0];

    // remove  cards from hand and deck
    newState.player1_cards   = remove(oldState.player1_cards, p1bid);
    newState.player2_cards   = remove(oldState.player2_cards, p2bid);
    newState.deck_cards      = remove(oldState.deck_cards, prize);

    // Winner gets the value of prize
    if(p1bid > p2bid ) {
      newState.player1_score = oldState.player1_score + calcFaceValue(prize.value);
    } else if (p2bid  > p1bid ) {
      newState.player2_score = oldState.player2_score + calcFaceValue(prize.value);
    } // In case of a tie, no points awarded

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
    cards = _.without(cards, removal);
  });
  return cards;
}

function getCards(suit) {
  var cards = []
  for (var i = 0; i < 13; i++) {
    cards.push({suit: suit, value: i+1});
  }
  return cards;
}

function calcFaceValue(value) {
  return Number(
    value.toString()
    .replace('A', 1)
    .replace('J', 11)
    .replace('Q', 12)
    .replace('K', 13)
  );
}
