
$("document").ready(function () {
  $("#search-btn").click(function (e) {
      e.preventDefault();
      $.ajax({
        url: $(this).attr(action),
        method: $(this).attr(method),
        data: $(this).serialize(),
        success: function (data) {
          $("#test").html(data);
        },
        error: function (jXHR, textStatus, errorThrown) {
        alert(errorThrown);
        }
      }); // AJAX Get Jquery statment
    });
  }); // Click effect
