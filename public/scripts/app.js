$(() => {
  // Use ajax to ge rankings for game
  $('select.rankings-game').on('change', function() {
    $.ajax({
      url: '/rankings/' + this.id,
      success: function(rankings) {
        alert(rankings);
      }
    });
  });
});
