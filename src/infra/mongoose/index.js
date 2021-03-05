// const { ModelsLoader } = require('src/infra/sequelize');
// const { Sequelize, DataTypes } = require('sequelize');
// const { db: config } = require('config');

// if (config) {
//   const sequelize = new Sequelize(config);
//   const dataTypes = DataTypes;
//   // console.log('on index');
//   // console.log(dataTypes);

//   module.exports = ModelsLoader.load({
//     sequelize,
//     dataTypes,
//     baseFolder: __dirname
//   });
// } else {
//   /* eslint-disable no-console */
//   console.error('Database configuration not found, disabling database.');
//   /* eslint-enable no-console */

const mongoose = require('mongoose');

module.exports = ({ logger, config }) => {

  const uri = `mongodb://${config.db.host}/${config.db.port}/${config.db.database}`;

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

  mongoose.connection.on('error', (err) => {
    logger.error('Unable to connect to Database.', err.message);
    process.exit(1);
  });


  mongoose.set('debug', true);

  mongoose.connect(uri, connectionOptions);

  return mongoose.connection;

};