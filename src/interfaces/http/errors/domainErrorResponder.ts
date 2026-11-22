import type { NextFunction, Response } from 'express';
import Status from 'http-status';
import { ValidationError } from '../../../domain/errors/ValidationError';
import { NotFoundError } from '../../../domain/errors/NotFoundError';

/**
 * The single place domain errors become HTTP responses.
 * Anything else is handed to the Express error handler via next().
 */
export function handleDomainError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(Status.BAD_REQUEST).json({
      type: 'ValidationError',
      details: err.details
    });

    return;
  }

  if (err instanceof NotFoundError) {
    res.status(Status.NOT_FOUND).json({
      type: 'NotFoundError',
      details: err.details
    });

    return;
  }

  next(err);
}