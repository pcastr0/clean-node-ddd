module.exports = {
  development: {
    database: 'clean_node_ddd_dev',
    host: process.env.DB_LOCAL_HOST,
    port: process.env.DB_LOCAL_PORT
  },
  test: {
    database: 'clean_node_ddd_test',
    host: process.env.DB_TEST_HOST,
    port: process.env.DB_TEST_PORT
  },
  production: process.env.CLEARDB_DATABASE_URL
};
