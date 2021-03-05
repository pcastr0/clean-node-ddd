module.exports = {
  development: {
    database: 'clean-node-ddd',
    host: process.env.DB_LOCAL_HOST,
    port: process.env.DB_LOCAL_PORT
  },
  test: {
    database: 'clean-node-ddd',
    host: process.env.DB_TEST_HOST,
    port: process.env.DB_TEST_PORT
  },
  production: process.env.CLEARDB_DATABASE_URL
};
