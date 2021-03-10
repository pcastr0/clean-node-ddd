module.exports = {
  development: {
    username: 'ppcc_db',
    password: 'mysql_password',
    database: 'clean_node_ddd',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'ppcc_db',
    password: 'mysql_password',
    database: 'clean_node_ddd',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  production: process.env.DATABASE_URL
};
