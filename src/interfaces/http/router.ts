import { Router, json, type ErrorRequestHandler, type RequestHandler } from 'express';
import cors from 'cors';
import compression from 'compression';
import methodOverride from 'method-override';
import type { Config } from '../../../config';
import { usersRouter } from './user/UsersController';

interface RouterDeps {
  config: Config;
  containerMiddleware: RequestHandler;
  loggerMiddleware: RequestHandler;
  errorHandler: ErrorRequestHandler;
  swaggerMiddleware: RequestHandler[];
}

export default ({ config, containerMiddleware, loggerMiddleware, errorHandler, swaggerMiddleware }: RouterDeps): Router => {
  const router = Router();

  if (!config.isTest) {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(json())
    .use(compression())
    .use(containerMiddleware)
    .use('/docs', ...swaggerMiddleware);

  apiRouter.use('/users', usersRouter);

  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};