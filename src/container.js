const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');

const {
  CreateUser,
  GetAllUsers,
  GetUser
} = require('./app/user');

const UserSerializer = require('./interfaces/http/user/UserSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');

const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');

const logger = require('./infra/logging/logger');
const SequelizeUsersRepository = require('./infra/user/SequelizeUsersRepository');
const { database, user: UserModel } = require('./infra/database/models');

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
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler) 
  });

// Repositories
container.register({
  usersRepository: asClass(SequelizeUsersRepository).singleton()
});

// Database
container
  .register({
    database: asValue(database),
    UserModel: asValue(UserModel)
  });

// Operations
container.register({
  createUser: asClass(CreateUser),
  getAllUsers: asClass(GetAllUsers),
  getUser: asClass(GetUser)
});

// Serializers
container.register({
  userSerializer: asValue(UserSerializer)
});

module.exports = container;