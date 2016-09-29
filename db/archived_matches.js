const archivedMatchesRepo = {};

module.exports = (knex) => {
  archivedMatchesRepo.getArchivedMatches = (user_id, cb) => {
    knex
    .select('*')
    .from('archived_matches')
    .where('winner_id', 'like', user_id)
    .orWhere('loser_id', 'like', user_id)
    .asCallback((err, archived_matches) => {
      if (err) cb(err);
      cb(archived_matches.rows);
    });
  }

  return archivedMatchesRepo;
}
