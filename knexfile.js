require('dotenv').config({ path: '../.env' });

const defaultConfig = {
  migrations: {
    directory: './data/migrations',
  },
  seeds: { directory: './data/seeds' },
};

module.exports = {
  development: {
    ...defaultConfig,
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.HOST || 'localhost',
      database: process.env.DB_NAME,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS,
    },
  },
  test: {
    ...defaultConfig,
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  },
};
