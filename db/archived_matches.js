const archivedMatchesRepo = {};

module.exports = (knex) => {
  archivedMatchesRepo.getArchivedMatches = (user_id) => {
    return knex
    .select('archived_matches.*', 'winner.username AS winner_name', 'loser.username as loser_name')
    .from('archived_matches')
    .leftJoin('users AS winner', 'winner.id', 'archived_matches.winner_id')
    .leftJoin('users AS loser', 'loser.id', 'archived_matches.loser_id')
    .where('winner_id', '=', user_id)
    .orWhere('loser_id', '=', user_id);
  }

  return archivedMatchesRepo;
}
