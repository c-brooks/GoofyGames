
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('games').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('games').insert({id: 1, name: 'Goofspiel'}),
        knex('games').insert({id: 2, name: 'Go Fish'})
      ]);
    });
};
