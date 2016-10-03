$(() => {
  // Set match ID from URL
  var matchID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

// MY TURN
  // HIT
  $('.deck > div.card').on('click', function() {
    // Check if it's my turn

    if ($('.deck').length !== 0) {

      var cardSuit = $(this).attr('class').split(/\s+/)[1];
      var cardValue = $(this).find('span.number').html();

      $.ajax({
        method: 'post',
        url: '/matches/' + matchID + '/hit',
        data: { suit: cardSuit, value: cardValue }
      })

      $.ajax({
        method: 'get',
        url: '/matches/' + matchID + '/hit',
        data: { game_id: 2 },
        success: (results) => {
          console.log('\n\nResults:', results);
          $('.activePlayer').append($(this));
          $('.deck > div.card').find('.card').remove();
          $('.deck').append(generateCard(results.deck_cards[0].suit, results.deck_cards[0].value));
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

    $.ajax({
      method: 'get',
      url: '/matches/' + matchID + '/stand',
      success: (result) => {
        console.log('GET STAND', result);


      }
    })
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
            console.log('opp_turn results:', results);
            if (results.opponent_last_turn !== null) {
              // Show their card
              $('.opponent.cards').append(generateCard(results.opponent_last_turn.suit, results.opponent_last_turn.value));

              // Update scores
              $('.activePlayer-score').find('.score').html(results.activeplayer_score);
              $('.opponent-score').find('.score').html(results.opponent_score);

              // Clear board and set new prize
              setTimeout( () => {
                   var activeplayer_score    = $('.activePlayer-score').find('.score');
                   var opponent_score        = $('.opponent-score').find('.score');
                   var currActivePlayerScore = +activeplayer_score.html();
                   var currOpponentScore     = +opponent_score.html();



                   if (currActivePlayerScore < results.activeplayer_score) {
                     activeplayer_score.css({ scale: [8, 8], opacity: 0 });
                   } else if (currOpponentScore < results.opponent_score) {
                     opponent_score.css({ scale: [8, 8], opacity: 0 });
                   }

                   // Score transitions back to 1x scale with full opacity
                   activeplayer_score.html(results.activeplayer_score).transition({ scale: [1, 1], opacity: 1 });
                   opponent_score.html(results.opponent_score).transition({ scale: [1, 1], opacity: 1 });


                   setTimeout( () => {
                     myCard.remove();
                     theirCard.remove();
                     deckCard.remove();
                  // Display end game items if applicable
                  if (results.game_end !== null) {
                    clearInterval(checkMovesInterval);
                    $('.deck').html('<h2>GAME OVER</h2>');
                  } else {
                    $('.deck').append(generateCard(results.deck_cards.suit, results.deck_cards.value));
                  }
                 }, 1500);
               }, 1000);
             }
            checking = false;
          } // end results
        })
      } else {
        checking = false;
      }
    }
  }
});
