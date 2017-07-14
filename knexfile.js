// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/child_malnutrition_test',
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
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    useNullAsDefault: true,
  },
};
