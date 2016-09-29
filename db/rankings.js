const rankingsRepo = {};

module.exports = (knex) => {
  rankingsRepo.getUserRankings = (user_id) => {
    return knex
    .select('*')
    .from('rankings')
    .leftJoin('games', 'rankings.game_id', 'games.id')
    .where('player_id', '=', user_id);
  }

  return rankingsRepo;
}
