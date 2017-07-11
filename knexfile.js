// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/child_malnutrition_test',
    migrations: {
      directory: './db/migrations/tests',
    },
    seeds: {
      directory: './db/seeds/tests',
    },
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/child_malnutrition',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
