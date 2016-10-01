function generateCard(suit, val) {
  var suitChar = {
    clubs: '\u2663',
    diamonds: '\u2666',
    spades: '\u2660',
    hearts: '\u2665'
  }

  if (val === '1') { val = 'A' }
  if (val === '11') { val = 'J' }
  if (val === '12') { val = 'K' }
  if (val === '13') { val = 'Q' }

  const card = _.template(`
    <div class="card <%= suit %> small">
      <div class="front">
        <div class="corner top">
          <span class="number"><%= cardNum %></span>
          <span><%= suitChar[suit] %></span>
        </div>

        <% if (cardNum === '2') { %>
          <span class="suit top_center"><%= suitChar[suit] %></span>
          <span class="suit bottom_center"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '3') { %>
        <span class="suit top_center"><%= suitChar[suit] %></span>
          <span class="suit middle_center"><%= suitChar[suit] %></span>
          <span class="suit bottom_center"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '4') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '5') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit middle_center"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '6') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit middle_left"><%= suitChar[suit] %></span>
          <span class="suit middle_right"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '7') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit middle_left"><%= suitChar[suit] %></span>
          <span class="suit middle_top"><%= suitChar[suit] %></span>
          <span class="suit middle_right"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '8') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit middle_left"><%= suitChar[suit] %></span>
          <span class="suit middle_top"><%= suitChar[suit] %></span>
          <span class="suit middle_right"><%= suitChar[suit] %></span>
          <span class="suit middle_bottom"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '9') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit middle_top_left"><%= suitChar[suit] %></span>
          <span class="suit middle_center"><%= suitChar[suit] %></span>
          <span class="suit middle_top_right"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
          <span class="suit middle_bottom_left"><%= suitChar[suit] %></span>
          <span class="suit middle_bottom_right"><%= suitChar[suit] %></span>
        <% } else if (cardNum === '10') { %>
          <span class="suit top_left"><%= suitChar[suit] %></span>
          <span class="suit top_right"><%= suitChar[suit] %></span>
          <span class="suit middle_top_left"><%= suitChar[suit] %></span>
          <span class="suit middle_top_center"><%= suitChar[suit] %></span>
          <span class="suit middle_top_right"><%= suitChar[suit] %></span>
          <span class="suit bottom_left"><%= suitChar[suit] %></span>
          <span class="suit bottom_right"><%= suitChar[suit] %></span>
          <span class="suit middle_bottom_center"><%= suitChar[suit] %></span>
          <span class="suit middle_bottom_left"><%= suitChar[suit] %></span>
          <span class="suit middle_bottom_right"><%= suitChar[suit] %></span>
        <% } else { %>
          <span class="suit middle_center"><%= suitChar[suit] %></span>
        <% } %>

        <div class="corner bottom">
          <span class="number"><%= cardNum %></span>
          <span><%= suitChar[suit] %></span>
        </div>
      </div>

      <div class="back">

      </div>
    </div>
  `);
  return card({ suit: suit, cardNum: val, suitChar: suitChar });
}
