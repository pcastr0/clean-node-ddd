module.exports = {
  development: {
    username: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASS,
    database: 'clean_node_ddd_dev',
    host: process.env.DB_LOCAL_HOST,
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    database: 'clean_node_ddd_test',
    host: process.env.DB_TEST_HOST,
    dialect: 'mysql',
    logging: false
  },
  production: process.env.CLEARDB_DATABASE_URL
};
