"use strict"
const _      = require('underscore');
const match  = require('../db/matches.js');

const BUST = 21;
const SUITS  = ['spades', 'hearts', 'clubs', 'diamonds'];

module.exports = {
  newMatch: function (p1_id, p2_id) {

    const randSuits = shuffle(SUITS);
    let deck_cards  = [];//JSON.stringify(shuffle(getCards(deck_suit)));

    for (var i = 0; i < SUITS.length; i++) {
      deck_cards.push(getCards(SUITS[i]));
    }
    deck_cards = JSON.stringify(_.flatten(deck_cards));
    console.log('Creating new deck', deck_cards);
// whose_move is true if p1 to move, false if p2 to move
    let newMatch =
    {
      game_id: 2,
      whose_move: (Math.random > 0.5) ? 1 : 0 ,
      player1_id: p1_id,
      player2_id: p2_id,
      player1_score: 0,
      player2_score: 0,
      player1_last_turn: null,
      player2_last_turn: null,
      deck_cards: deck_cards,
      player1_cards: null,
      player2_cards: null,
      move_count: 0,

      game_start: new Date
    }
    return newMatch;
  },

  // If a player asks for another card
  // TODO: refactoring this to have cards, id, score under 1 'player' obj
  hit: function(oldState) {
    oldState = oldState[0];
    let newState = oldState;
    if(oldState.whose_move) { // p1 to move
      if(!newState.player1_cards) { newState.player1_cards = [] };
      newState.player1_cards.push(oldState.deck_cards[0]);

      let sumCards = newState.player1_cards.reduce((a, b) => {
        return parseInt(a.value) + parseInt(b.value);
      }, 0);
      if(sumCards > BUST) {
        alert('Bust!');
        newState.whose_move = oldState.whose_move  ? 0 : 1;
        newState.move_count = parseInt(oldState.move_count) + 1;
      }
    } else { // p2 to move
      if(!newState.player2_cards) { newState.player2_cards = []; }
      newState.player2_cards.push(oldState.deck_cards[0]);
      let sumCards = newState.player2_cards.reduce((a, b) => {
        return (a.value) + (b.value);
      }, 0);
      if(sumCards > BUST) {
        alert('Bust!');
        newState.whose_move = (oldState.move_count)  ? 0 : 1;
        newState.move_count = parseInt(oldState.move_count) + 1;
      }
    }
    oldState.deck_cards.shift()
    return newState;
  },

  // If player gets 21 or under, his cards are added to score.
  // If player busts, everything over 21 is subtracted.
  stand: function(oldState) {
    let newState = oldState;
    var sumCards = 0;
    // p1 stands
    if(oldState.whose_move == 0) {
      for(var i in newState.player1_cards) {
        sumCards += +newState.player1_cards[i].value;
      }
      if(sumCards <= BUST) {
        newState.player1_score += sumCards;
      }  else {
        newState.player1_score -= (sumCards - BUST)
      }
      newState.player1_cards = [];
    }
    else {
      for(var i in newState.player2_cards) {
        sumCards += +newState.player2_cards[i].value;
      }
      if(sumCards <= BUST) {
        newState.player2_score += sumCards;
      }  else {
        newState.player2_score -= (sumCards - BUST)
      }
      newState.player2_cards = [];

    newState.whose_move = oldState.whose_move  ? 0 : 1;
    newState.move_count = parseInt(oldState.move_count) + 1;
    }
    return newState;
  },

    calcFaceValue: function(value) {
    return Number(
      value.toString()
      .replace('A', 1)
      .replace('J', 11)
      .replace('Q', 12)
      .replace('K', 13)
    );
  }

}

function checkGameEnd(match){
  return (match.move_count > 9);
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
  cards = _.without(cards, removal);
  return cards;
}

function getCards(suit) {
  var cards = []
  for (var i = 0; i < 13; i++) {
    cards.push({suit: suit, value: (i+1).toString()});
  }
  return cards;
}
