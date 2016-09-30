const matchmakingRepo = {};

module.exports = (knex) => {
  matchmakingRepo.getPlayers = () => {
    return knex
    .select('*')
    .from('matchmaking')
  };

  matchmakingRepo.remove = (playerID) => {
    knex('matchmaking')
    .where({playerID: playerID})
    .del()
  }

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
    console.log("\nInserted " + playerID + " into " + "matchmaking table")
    })
  };
  return matchmakingRepo;
}
