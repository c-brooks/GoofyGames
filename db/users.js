const usersRepo = {};

module.exports = (knex) => {
  usersRepo.getUser = (user_id, cb) => {
    knex
    .select('*')
    .from('users')
    .where('id', '=', user_id)
    .asCallback((err, user) => {
      if (err) cb(err);
      cb(user[0]);
    });
  }

  return usersRepo;
}
