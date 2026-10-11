import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
      imgSrc: [
        "'self'",
        'data:',
        'https://res.cloudinary.com',
        'https://*.tile.openstreetmap.org',
        'https://unpkg.com',
      ],
      connectSrc: ["'self'", env.API_URL, env.WEB_URL, 'https://unpkg.com'],
      fontSrc: ["'self'", 'https://unpkg.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

const allowedOrigins = [env.WEB_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Blocked by CORS policy', 'FORBIDDEN', 403));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'x-request-id'],
});

export const hppMiddleware: RequestHandler = hpp() as RequestHandler;

/**
 * Strips NoSQL operators: recursively rejects any object keys starting with '$' or containing '.'
 */
export function sanitizeNoSqlInput(req: Request, _res: Response, next: NextFunction): void {
  function checkObject(obj: unknown): boolean {
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj as Record<string, unknown>)) {
        if (key.startsWith('$') || key.includes('.')) {
          return false;
        }
        if (!checkObject((obj as Record<string, unknown>)[key])) {
          return false;
        }
      }
    }
    return true;
  }

  if (req.body && !checkObject(req.body)) {
    return next(AppError.badRequest('Invalid characters detected in payload keys'));
  }
  if (req.query && !checkObject(req.query)) {
    return next(AppError.badRequest('Invalid characters detected in query keys'));
  }
  if (req.params && !checkObject(req.params)) {
    return next(AppError.badRequest('Invalid characters detected in param keys'));
  }

  next();
}
