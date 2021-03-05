const mongoose = require('mongoose');

module.exports = ({ logger, config }) => {

  const uri = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;
  console.log(uri);

  const connectionOptions = {
    keepAlive: 1,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    // reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 500,
    // connectTimeoutMS: 10000,
  };
  

  // mongoose.Promise = Promise;

  mongoose.connection.on('error', (err) => {
    logger.error('Unable to connect to Database.', err.message);
    process.exit(1);
  });


  mongoose.set('debug', (collectionName, method, query, doc) => {
    logger.info(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });

  mongoose.connect(uri, connectionOptions);

  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    mongoose.connection.on('connected', () => {
      logger.info(`Database connection is open to ${uri}`);
      resolve(mongoose.connection);
    });
  });

};