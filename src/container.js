const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');

const container = createContainer();

// Server
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middleware
// container
//   .register({
//     containerMiddleware: asValue(scopePerRequest(container))
//   });

module.exports = container;