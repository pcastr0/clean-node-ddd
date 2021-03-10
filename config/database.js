module.exports = {
  development: {
    database: 'clean_node_ddd_dev',
    host: '127.0.0.1',
    port: '27017'
  },
  test: {
    database: 'clean_node_ddd_test',
    host: '127.0.0.1',
    port: '27017'
  },
  production: process.env.DATABASE_URL
};
