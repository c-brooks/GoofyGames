const matchmakingRepo = {};

module.exports = (knex) => {
  matchmakingRepo.getPlayers = () => {
    return knex
    .select('*')
    .from('matchmaking')
  };

  matchmakingRepo.removeOneByUserID = (player_id) => {
    console.log("\nSHOULD DELETE", player_id);
    //return
    knex('matchmaking').first().del().where({player_id: player_id}).then(() => {

    });
  }

  matchmakingRepo.checkForChallenges = (player_id, gameID) => {
    return knex
    .first('*')
    .from('matchmaking')
    .where({game_id: gameID})
    .whereNot({player_id: player_id})
  };

  matchmakingRepo.getUserChallenges = (player_id) => {
    return knex
    .select('*')
    .from('matchmaking')
    .where({player_id: player_id})
  };

  matchmakingRepo.new = (player_id, gameID) => {
    return
    knex('matchmaking')
    .insert({
        player_id: player_id,
        game_id: gameID
      })
    .then( () => {
    console.log("\nInserted " + player_id + " into " + "matchmaking")
    })
  };
  return matchmakingRepo;
}
