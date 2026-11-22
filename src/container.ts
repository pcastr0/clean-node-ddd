import { createContainer, asClass, asFunction, asValue, type AwilixContainer } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { Sequelize } from 'sequelize';
import type { Logger } from 'log4js';

import config from '../config';
import type { Config } from '../config';
import { Application } from './app/Application';
import { CreateUser, DeleteUser, GetAllUsers, GetUser, UpdateUser } from './app/user';
import { Server } from './interfaces/http/Server';
import router from './interfaces/http/router';
import loggerMiddleware from './interfaces/http/logging/loggerMiddleware';
import errorHandler from './interfaces/http/errors/errorHandler';
import devErrorHandler from './interfaces/http/errors/devErrorHandler';
import swaggerMiddleware from './interfaces/http/swagger/swaggerMiddleware';
import { UserSerializer } from './interfaces/http/user/UserSerializer';
import logger from './infra/logging/logger';
import { SequelizeUsersRepository } from './infra/user/SequelizeUsersRepository';
import { database, user as UserModel } from './infra/database/models';
import type { UserModelStatic } from './infra/database/models/user';
import type { User, UserData } from './domain/user/User';
import type { UsersRepository } from './domain/user/UsersRepository';

export interface Cradle {
  app: Application;
  server: Server;
  router: RequestHandler;
  logger: Logger;
  loggerMiddleware: RequestHandler;
  containerMiddleware: RequestHandler;
  errorHandler: ErrorRequestHandler;
  swaggerMiddleware: RequestHandler[];
  config: Config;
  database: Sequelize | undefined;
  UserModel: UserModelStatic;
  usersRepository: UsersRepository;
  createUser: CreateUser;
  getAllUsers: GetAllUsers;
  getUser: GetUser;
  updateUser: UpdateUser;
  deleteUser: DeleteUser;
  userSerializer: { serialize(user: User): UserData };
}

declare global {
  // Express's Request augmentation requires a global namespace declaration.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      container: AwilixContainer<Cradle>;
    }
  }
}

const container: AwilixContainer<Cradle> = createContainer<Cradle>();

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
    errorHandler: asValue(config.isProduction ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue(swaggerMiddleware)
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

// Use cases
container.register({
  createUser: asClass(CreateUser),
  getAllUsers: asClass(GetAllUsers),
  getUser: asClass(GetUser),
  updateUser: asClass(UpdateUser),
  deleteUser: asClass(DeleteUser)
});

// Serializers
container.register({
  userSerializer: asValue(UserSerializer)
});

export default container;