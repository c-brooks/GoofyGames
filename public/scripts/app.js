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
    var cardValue = $(this).find('span.number').html();
    var cardSuit = $(this).attr('class').split(/\s+/)[1];
    $.ajax({
      url: '/matches/' + matchID + '/last_turn',
      success: (lastTurn) => {
        if (lastTurn.player_last_turn === null) {
          // // TODO animate the transition
          // $(this).transition({ x: -moveHere.left, y: -moveHere.top });
          $('.myMove').append($(this));
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
        checkMoves();
      }
    });
  });

  $('.activePlayer').find('.card').on('mouseover', function() {
    $(this).css({ scale: [2, 2] });
    // $(this).transition({ y: '100px' });
  });

  $('.activePlayer').find('.card').on('mouseout', function() {
    $(this).css({ scale: [1, 1] });
  });

  checkMoves(); // Check moves when loading game
  function checkMoves() {
    // If active player has made a move
    if ($('.myMove').find('.card').html().length) {
      $.ajax({
        url: '/matches/' + matchID + '/opp_turn',
        success: (lastTurn) => {
          var opponent_turn = lastTurn.player_last_turn;
          if (opponent_turn !== null && $.trim($('.theirMove').html()).length === 0) {
            $('.theirMove').append(generateCard(opponent_turn.suit, opponent_turn.value));
          }
        }
      });
    };
  }
});
