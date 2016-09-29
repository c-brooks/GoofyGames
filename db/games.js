const gamesRepo = {};

module.exports = (knex) => {

  gamesRepo.getAllGames = () => {
    return knex
    .select('*')
    .from('games');
  }

  return gamesRepo;
}
