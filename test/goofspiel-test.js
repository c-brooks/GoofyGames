const assert = require('assert');
const goofspiel = require('../game-logic/goofspiel');

describe("Create hands", function () {
  it("should create players hands", function() {
    testGame = goofspiel.newMatch();
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], testGame.p1_cards);
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], goofspiel.game.p2.cards);
  });
});

describe("Shuffle deck", function () {
  it("should shuffle deck", function() {
    testGame = goofspiel.newMatch();
    var deckOne = testGame.deck_cards;
    assert.notEqual(testGame.deck_cards, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });
  it("should shuffle deck randomly every time", function() {
    var testGame = goofspiel.newMatch();
    var deckOne = testGame.deck_cards;
    testGame = goofspiel.newMatch();
    var deckTwo = testGame.deck_cards;
    assert.notEqual(deckOne, deckTwo);
  });
});


describe("Move", function () {
  it("should determine winner of a round", function () {
    var testGame = goofspiel.newMatch();
    // Player 1 wins
    goofspiel.move(10, 1, 13);
    assert.equal(goofspiel.game.p1.score, 13, "winner gets prize");
    assert.equal(goofspiel.game.p2.score, 0, "loser gets nothing");

    // Reset
    var testGame = goofspiel.newMatch();

    // Player 2 wins
    goofspiel.move(3, 7, 12);
    assert.equal(goofspiel.game.p1.score, 0, "winner gets prize");
    assert.equal(goofspiel.game.p2.score, 12, "loser gets nothing");
  });
  it("should remove cards from players hands", function () {
    var testGame = goofspiel.newMatch();

    assert.equal(goofspiel.game.p1.cards.length, 13, "player 1 new hand");
    assert.equal(goofspiel.game.p2.cards.length, 13, "player 2 new hand");
    goofspiel.move(10, 1, 13);
    assert.equal(goofspiel.game.p1.cards.length, 12, "player 1 lost a card");
    assert.equal(goofspiel.game.p2.cards.length, 12, "player 2 lost a card");
  });

  it("should remove cards from deck", function () {
    var testGame = goofspiel.newMatch();

    assert.equal(testGame.deck_cards.length, 13, "new deck");
    goofspiel.move(10, 1, 13);
    assert.equal(testGame.deck_cards.length, 12, "deck lost a card");
  });
});

describe("Game End", function () {
  it("should end after 13 rounds", function () {
    var i;
    var testGame = goofspiel.newMatch();
    // Make 12 moves
    for(i = 0; i < 13; i ++){
      goofspiel.move(3, 7, i);
      console.log(`turn ${i} `);
      assert.deepEqual(goofspiel.checkGameEnd(), false, `Turn ${i}, game not over yet`);
    }
    // Last move should end game
    goofspiel.move(3, 7, i);
    assert.deepEqual(goofspiel.checkGameEnd(), true, `Turn ${i}, game is over`)
  });
});




