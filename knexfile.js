// Update with your config settings.

module.exports = {

  dev: {
    client: 'pg',
    connection: {
      database: 'redditclone_dev',
      host: 'localhost',
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'redditclone_test',
      host: 'localhost',
    }
  },

};
