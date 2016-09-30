const matchmakingRepo = {};

module.exports = (knex) => {
  matchmakingRepo.getPlayers = () => {
    return knex
    .select('*')
    .from('matchmaking')
  };

  matchmakingRepo.remove = () => {
    return true;
  }

  matchmakingRepo.checkForChallenges = (playerID, gameID) => {
    return knex
    .first('*')
    .from('matchmaking')
    .where({game_id: gameID})
    .whereNot({player_id: playerID})
  };

  matchmakingRepo.new = (playerID, gameID) => {
    knex('matchmaking')
    .insert(
      {player_id: playerID, game_id: gameID}
    ).then( () => {
    console.log("\ninserted " + playerID + " into " + " matchmaking")
    })
  };
  return matchmakingRepo;
}
