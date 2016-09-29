const usersRepo = {};

module.exports = (knex) => {
  usersRepo.getUser = (user_id) => {
    return knex
    .select('*')
    .from('users')
    .where('id', '=', user_id);
  }

  return usersRepo;
}
