exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, username: 'bigjohn77'}),
        knex('users').insert({id: 2, username: 'fierytomato'}),
        knex('users').insert({id: 3, username: 'l337hax0r'})
        knex('users').insert({id: 4, username: 'ErikWeisz13'})
        knex('users').insert({id: 5, username: 'Stan'})
      ]);
    });
};
