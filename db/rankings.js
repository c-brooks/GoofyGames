const rankingsRepo = {};

module.exports = (knex) => {
  rankingsRepo.getUserRankings = (user_id, cb) => {
    knex
    .select('*')
    .from('rankings')
    .leftJoin('games', 'rankings.game_id', 'games.id')
    .where('player_id', '=', user_id)
    .asCallback((err, rankings) => {
      if (err) cb(err);
      cb(rankings);
    });
  }

  return rankingsRepo;
}
