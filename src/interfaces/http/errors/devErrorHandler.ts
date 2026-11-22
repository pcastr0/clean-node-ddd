import type { ErrorRequestHandler } from 'express';
import Status from 'http-status';

const devErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { logger } = req.container.cradle;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: err.message,
    stack: err.stack
  });
};

export default devErrorHandler;