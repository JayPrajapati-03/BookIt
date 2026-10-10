import { ERROR_CODES, type ErrorCode } from '@bookit/shared';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details: Record<string, unknown> | null;

  constructor(
    message: string,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: number = 500,
    details: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new AppError(message, ERROR_CODES.VALIDATION_ERROR, 400, details ?? null);
  }

  static unauthorized(message: string = 'Authentication required') {
    return new AppError(message, ERROR_CODES.UNAUTHORIZED, 401);
  }

  static forbidden(message: string = 'Access denied') {
    return new AppError(message, ERROR_CODES.FORBIDDEN, 403);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, ERROR_CODES.NOT_FOUND, 404);
  }

  static conflict(message: string, details?: Record<string, unknown>) {
    return new AppError(message, ERROR_CODES.CONFLICT, 409, details ?? null);
  }

  static soldOut(message: string, details?: Record<string, unknown>) {
    return new AppError(message, ERROR_CODES.SOLD_OUT, 409, details ?? null);
  }

  static holdExpired(message: string = 'The hold on this room has expired') {
    return new AppError(message, ERROR_CODES.HOLD_EXPIRED, 410);
  }
}
