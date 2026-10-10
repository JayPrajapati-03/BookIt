import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ERROR_CODES, type ApiErrorEnvelope } from '@bookit/shared';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.id || 'unknown';

  if (err instanceof AppError) {
    logger.warn({ err, requestId, path: req.path }, 'Application error handled');
    const envelope: ApiErrorEnvelope = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    };
    res.status(err.statusCode).json(envelope);
    return;
  }

  if (err instanceof ZodError) {
    logger.warn({ err: err.flatten(), requestId, path: req.path }, 'Validation error handled');
    const envelope: ApiErrorEnvelope = {
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Request input validation failed',
        details: {
          fieldErrors: err.flatten().fieldErrors,
          formErrors: err.flatten().formErrors,
        },
        requestId,
      },
    };
    res.status(400).json(envelope);
    return;
  }

  // Fallback internal server error
  logger.error({ err, requestId, path: req.path }, 'Unhandled server error');
  const envelope: ApiErrorEnvelope = {
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'An unexpected internal error occurred. Please try again.',
      details: null,
      requestId,
    },
  };
  res.status(500).json(envelope);
}
