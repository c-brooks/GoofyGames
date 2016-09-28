const assert = require('assert');
const goofspiel = require('../game-logic/goofspiel');

describe("Create hands", function () {
  it("should create players hands", function() {
    goofspiel.initGame();
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], goofspiel.game.p1.cards);
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], goofspiel.game.p2.cards);
  });
});

describe("Shuffle deck", function () {
  it("should shuffle deck", function() {
    goofspiel.initGame();
    var deckOne = goofspiel.game.deck.cards;
    assert.notEqual(goofspiel.game.deck.cards, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });
  it("should shuffle deck randomly every time", function() {
    goofspiel.initGame();
    var deckOne = goofspiel.game.deck.cards;
    goofspiel.initGame();
    var deckTwo = goofspiel.game.deck.cards;
    assert.notEqual(deckOne, deckTwo);
  });
});


describe("Move", function () {
  it("should determine winner of a round", function () {
    goofspiel.initGame();
    // Player 1 wins
    goofspiel.move(10, 1, 13);
    assert.equal(goofspiel.game.p1.score, 13, "winner gets prize");
    assert.equal(goofspiel.game.p2.score, 0, "loser gets nothing");

    // Reset
    goofspiel.initGame();
    // Player 2 wins
    goofspiel.move(3, 7, 12);
    assert.equal(goofspiel.game.p1.score, 0, "winner gets prize");
    assert.equal(goofspiel.game.p2.score, 12, "loser gets nothing");
  });
  it("should remove cards from players hands", function () {
    goofspiel.initGame();

    assert.equal(goofspiel.game.p1.cards.length, 13, "player 1 initial hand");
    assert.equal(goofspiel.game.p2.cards.length, 13, "player 2 initial hand");
    goofspiel.move(10, 1, 13);
    assert.equal(goofspiel.game.p1.cards.length, 12, "player 1 lost a card");
    assert.equal(goofspiel.game.p2.cards.length, 12, "player 2 lost a card");
  });

  it("should remove cards from deck", function () {
    goofspiel.initGame();

    assert.equal(goofspiel.game.deck.cards.length, 13, "initial deck");
    goofspiel.move(10, 1, 13);
    assert.equal(goofspiel.game.deck.cards.length, 12, "deck lost a card");
  });
});

describe("Game End", function () {
  it("should end after 13 rounds", function () {
    var i;
    goofspiel.initGame();

    for(i = 0; i < 13; i ++){
      goofspiel.move(3, 7, i);
      console.log(`turn ${i} `);
      assert.deepEqual(goofspiel.checkGameEnd(), false, `Turn ${i}, game not over yet`);
    }
    goofspiel.move(3, 7, i);
    assert.deepEqual(goofspiel.checkGameEnd(), true, `Turn ${i}, game is over`)
  });
});


