$(() => {
  // Set match ID from URL
  var matchID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

  // Use ajax to get rankings for game
  $('select.rankings-game').on('change', function() {
    $.ajax({
      url: '/rankings/' + $(this).val(),
      success: (rankings) => {
        var table = $('table.rankings tbody');
        // Remove currently loaded rankings
        table.empty();
        if (rankings.length === 0) {
          table.append('<tr><td colspan="100%">No Rankings Found!</td></tr>')
        } else {
          for (i = 0; i < rankings.length; i++) {
            var currRank = rankings[i];
            var rank = i + 1;
            // Build table row
            var $row       = $('<tr>');
            var $rank      = $('<td>').html(rank).appendTo($row);
            var $user      = $('<td>').html('<a href="/users/' + currRank.id + '">' + currRank.username + '</a>').appendTo($row);
            var $wins      = $('<td>').html(currRank.wins).appendTo($row);
            var $losses    = $('<td>').html(currRank.losses).appendTo($row);

            table.append($row);
          }
        }
      }
    });
  });

  $('.activePlayer').find('.card').on('click', function() {
    if ($('.myMove').find('.card').length === 0 && $('.deck > h2').html() !== 'GAME OVER') {
      // Play card on table
      $('.myMove').append($(this));

      // Play card on server
      var cardSuit = $(this).attr('class').split(/\s+/)[1];
      var cardValue = $(this).find('span.number').html();
      // Doesn't handle errors with playing a card
      $.ajax({
        method: 'post',
        url: '/matches/' + matchID + '/play_card',
        data: { suit: cardSuit, value: cardValue }
      });
    } else {
      // Shake the card because it's not their turn
      $(this).transition({ x: -10 }, 100)
      .transition({ x: +10 }, 100)
      .transition({ x: -10 }, 100)
      .transition({ x: +10}, 100)
      .transition({ x: 0}, 100);
    }
  });

  $('.activePlayer').find('.card').on('mouseover', function() {
    $(this).css({ scale: [2, 2] });
    // $(this).transition({ y: '100px' });
  });

  $('.activePlayer').find('.card').on('mouseout', function() {
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
      if ($('.myMove').find('.card').length !== 0) {
        $.ajax({
          url: '/matches/' + matchID + '/opp_turn',
          success: (results) => {
            console.log(results);
            if (results.opponent_last_turn !== null) {
              // Show their card
              console.log(results);
              $('.theirMove').append(generateCard(results.opponent_last_turn.suit, results.opponent_last_turn.value));

              // Remove card from their hand
              $('.opponent.cards > div.card').last().remove();

              // Clear board and set new prize
              setTimeout(
                function(){
                  var activeplayer_score    = $('.activePlayer-score').find('.score');
                  var opponent_score        = $('.opponent-score').find('.score');
                  var currActivePlayerScore = +activeplayer_score.html();
                  var currOpponentScore     = +opponent_score.html();

                  var myCard    = $('.myMove').find('.card');
                  var theirCard = $('.theirMove').find('.card');
                  var deckCard  = $('.deck').find('.card');

                  // Slide cards to winner & update scores
                  // Score is set to be 8x scale and 0 opacity
                  if (currActivePlayerScore < results.activeplayer_score) {
                    myCard.transition({ x: -9000 }, 1500);
                    theirCard.transition({ x: -9000 }, 1500);
                    deckCard.transition({ x: -9000 }, 1500);
                    activeplayer_score.css({ scale: [8, 8], opacity: 0 });
                  } else if (currOpponentScore < results.opponent_score) {
                    myCard.transition({ x: +9000 }, 1500);
                    theirCard.transition({ x: +9000 }, 1500);
                    deckCard.transition({ x: +9000 }, 1500);
                    opponent_score.css({ scale: [8, 8], opacity: 0 });
                  }

                  // Score transitions back to 1x scale with full opacity
                  activeplayer_score.html(results.activeplayer_score).transition({ scale: [1, 1], opacity: 1 });
                  opponent_score.html(results.opponent_score).transition({ scale: [1, 1], opacity: 1 });

                  // Remove cards from board and add new deck card (after animations done)
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

                 },
                 1000
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

  // Spinner options
  var onLoadOpts = {
    lines: 15 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 3 // The line thickness
    , radius: 60 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#CC2A41' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 50 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 50 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '80px' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'relative' // Element positioning
  }

  $('.search').find('.panel-body').append(new Spinner(onLoadOpts).spin().el);

    // Spinner options
  var dynamicOpts = {
    lines: 15 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 3 // The line thickness
    , radius: 60 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#CC2A41' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 50 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 50 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '110px' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'relative' // Element positioning
  }

  $('.game-search').on('click', function(e) {
    var gameID = $('#game-dropdown').find(':selected').val();
    var gameName = $('#game-dropdown').find(':selected').html();
    $.ajax({
      url: '/matches',
      method: 'POST',
      data: { game: gameID },
      success: function(result) {
        var newSearchBox = $(`
          <div class="panel panel-default match-btn search">
            <div class="panel-body text-center">
            </div>
          </div>`)
        $('.matches-box').append(newSearchBox);
        newSearchBox.html(new Spinner(dynamicOpts).spin().el);
        newSearchBox.append('Searching for ' + gameName + '...');
      }
    });
  });
});
