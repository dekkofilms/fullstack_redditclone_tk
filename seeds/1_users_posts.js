
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({id: 1, first_name: 'taylor', last_name: 'king', email: 'dekko@gmail.com', password: 'password1'}),
        knex('users').insert({id: 2, first_name: 'tim', last_name: 'chew', email: 'tim@gmail.com', password: 'password2'}),
        knex('users').insert({id: 3, first_name: 'sam', last_name: 'spillman', email: 'sam@gmail.com', password: 'password3'}),
      ]);
    });
};
