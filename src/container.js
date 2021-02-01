const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');

const loggerMiddleWare = require('./interfaces/http/logging/loggerMiddleware');

const logger = require('./infra/logging/logger');
const { database } = require('./infra/database/models')

const container = createContainer();

// Server
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middleware
container
  .register({
    loggerMiddleWare: asFunction(loggerMiddleWare).singleton()
  });

// Database
container
  .register({
    database: asValue(database)
  })

module.exports = container;