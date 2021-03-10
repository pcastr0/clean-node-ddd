const mongoose = require('mongoose');

module.exports = ({ logger, config }) => {
  if(config) {
    let uri = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;

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

    mongoose.Promise = Promise;

    mongoose.connection.on('error', (error) => {
      logger.error('Unable to connect to Database.', error.message);
      process.exit(1);
    });

    mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.info(`${collectionName}.${method}`, JSON.stringify(query), doc);
    });

    mongoose.connect(uri, connectionOptions);

    return new Promise((resolve, reject) => {
      mongoose.connection.on('connected', () => {
        logger.info('Database is connected.');
        resolve(mongoose.connection);
      });
    });

  } else {
    logger.error('Database config not found. Disabling Database.');
  }
};