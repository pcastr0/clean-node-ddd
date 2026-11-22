import type { ErrorRequestHandler } from 'express';
import Status from 'http-status';

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { logger } = req.container.cradle;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: 'The server failed to handle this request'
  });
};

export default errorHandler;