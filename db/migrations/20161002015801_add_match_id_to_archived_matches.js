exports.up = function(knex, Promise) {
  return knex.schema.table('archived_matches', function(table) {
    table.integer('match_id');
    table.unique('match_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('archived_matches', function(table) {
    table.dropColumn('match_id');
  });
};
