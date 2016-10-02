const rankingsRepo = {};

module.exports = (knex) => {
  rankingsRepo.getUserRankings = (user_id) => {
    return knex
    .select('*')
    .from('rankings')
    .leftJoin('games', 'rankings.game_id', 'games.id')
    .where('player_id', '=', user_id);
  },

  rankingsRepo.getGlobalRankings = (game_id) => {
    return knex
    .select('*')
    .from('rankings')
    .leftJoin('users', 'rankings.player_id', 'users.id')
    .where('game_id', '=', game_id)
    .orderBy('wins', 'desc');
  }

  rankingsRepo.addWin = (player_id) => {
    return knex('rankings')
    .where('player_id', '=', player_id)
    .increment('wins', 1);
  }

  rankingsRepo.addLoss = (player_id) => {
    return knex('rankings')
    .where('player_id', '=', player_id)
    .increment('losses', 1);
  }


  return rankingsRepo;
}
