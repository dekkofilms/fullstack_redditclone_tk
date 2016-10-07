
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('posts').insert({id: 1, content: 'sadfhawlhfe', link: 'google.com', user_id: 2}),
        knex('posts').insert({id: 2, content: 'aefwafewf', link: 'google.com', user_id: 2}),
        knex('posts').insert({id: 3, content: 'dhfgdhdfhf', link: 'google.com', user_id: 3}),
        knex('posts').insert({id: 4, content: 'q232rqr32r', link: 'google.com', user_id: 3}),
        knex('posts').insert({id: 5, content: 'afasdcxczxcxzc', link: 'google.com', user_id: 3}),
        knex('posts').insert({id: 6, content: 'dwqdqdqdwd', link: 'google.com', user_id: 3}),
        knex('posts').insert({id: 7, content: 'sadfhdqwdawlhfe', link: 'google.com', user_id: 1}),
        knex('posts').insert({id: 8, content: 'sadfhgrehegewfawfawlhfe', link: 'google.com', user_id: 1}),
        knex('posts').insert({id: 9, content: 'sawefewfafsfadfhawlhfe', link: 'google.com', user_id: 1}),
        knex('posts').insert({id: 10, content: 'sadfhagewgawdafewwlhfe', link: 'google.com', user_id: 1}),
      ]);
    });
};
