$(() => {
  // Set match ID from URL
  var matchID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

// MY TURN
  // HIT
  $('.deck > div.card').on('click', function() {
    if ($('.deck').length !== 0 && $('.deck > h2').html() !== 'GAME OVER') {

      var cardSuit = $(this).attr('class').split(/\s+/)[1];
      var cardValue = $(this).find('span.number').html();

      $.ajax({
        method: 'post',
        url: '/matches/' + matchID + '/hit',
        data: { suit: cardSuit, value: cardValue },
        success: (results) => {
         $('.activePlayer').append(generateCard(cardSuit, cardValue));
         $('.deck > div.card').find('.card').remove();
        }
      })

      $.ajax({
        method: 'get',
        url: '/matches/' + matchID + '/hit',
        data: { game_id: 2 },
        success: (results) => {
          console.log('\n\nResults:', results.deck_cards);
          //$('.activePlayer').append(generateCard(results.deck_cards[0].suit, results.deck_cards[0].value));
          //$('.deck > div.card').find('.card').remove();
          //$('.deck > div.card').append(generateCard(results.deck_cards[1].suit, results.deck_cards[1].value));
        }
      })

    } else {
      // Shake the card because it's not their turn
      $(this).transition({ x: -10 }, 100)
      .transition({ x: +10 }, 100)
      .transition({ x: -10 }, 100)
      .transition({ x: +10}, 100)
      .transition({ x: 0}, 100);
    }
  });

    // STAND
  $('.activePlayer').find('.card').on('click', () => {

      $.ajax({
        method: 'POST',
        url: '/matches/' + matchID + '/stand',
        success: () => {
      $('.activePlayer > div.card').remove()

        }
      });
  //  }
  })


// ANIMATIONS
  $('.deck').on('mouseover', function() {
    $(this).css({ scale: [2, 2] });
  });
  $('.activePlayer').find('.card').on('mouseover', function() {
    $(this).css({ scale: [2, 2] });
  });
  $('.activePlayer').find('.card').on('mouseout', function() {
    $(this).css({ scale: [1, 1] });
  });
  $('.deck').on('mouseout', function() {
    $(this).css({ scale: [1, 1] });
  });




  // Check moves
  // Assign to variable so we can stop checking when needed
  var checking = false;
  var checkMovesInterval = setInterval(checkMoves, 100);
  function checkMoves() {
    if (!checking) {
      checking = true;
      // If active player has made a move
      if ($('.activePlayer').find('.card').length === 0) {
        $.ajax({
          url: '/matches/' + matchID + '/opp_turn',
          success: (results) => {
            console.log(results);
            if (results.opponent_last_turn !== null) {
              // Show their card
              //$('.theirMove').append(generateCard(results.opponent_last_turn.suit, results.opponent_last_turn.value));

              // Remove card from their hand
              $('.opponent.cards > div.card').last().remove();

              // Update scores
              $('.activePlayer-score').find('.score').html(results.activeplayer_score);
              $('.opponent-score').find('.score').html(results.opponent_score);

              // Clear board and set new prize
              setTimeout(
                 function(){
                  //$('.myMove > div.card').remove();
                  $('.theirMove > div.card').remove();
                  $('.deck > div.card').remove();

                  // Display end game items if applicable
                  if (results.game_end !== null) {
                    clearInterval(checkMovesInterval);
                    $('.deck').html('<h2>GAME OVER</h2>');
                  } else {
                    $('.deck').append(generateCard(results.deck_cards.suit, results.deck_cards.value));
                  }
                 },
                 2000
              );
            }
            checking = false;
          }
        })
      } else {
        checking = false;
      };
    }
  }
});
