const rankingsRepo = {};

module.exports = (knex) => {
  rankingsRepo.getUserRankings = (user_id, cb) => {
    knex
    .select('*')
    .from('rankings')
    .where('player_id', '=', user_id)
    .asCallback((err, rankings) => {
      if (err) cb(err);
      cb(rankings);
    });
  }

  return rankingsRepo;
}
