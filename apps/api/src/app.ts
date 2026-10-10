import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import { requestIdMiddleware } from './middlewares/requestId.js';
import {
  helmetMiddleware,
  corsMiddleware,
  hppMiddleware,
  sanitizeNoSqlInput,
} from './middlewares/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { isDbConnected } from './db/connection.js';
import { AppError } from './utils/errors.js';
import { apiRouter } from './routes/api.routes.js';

export function createApp(): Express {
  const app = express();

  // Basic trust proxy
  app.set('trust proxy', 1);

  // Request ID tracking
  app.use(requestIdMiddleware);

  // Security middlewares
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(hppMiddleware);

  // Body parsers
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());

  // NoSQL operator stripping
  app.use(sanitizeNoSqlInput);

  // Root & Health check routes
  app.get('/', (_req, res) => {
    res.json({
      name: 'BookIt API',
      status: 'healthy',
      version: '1.0.0',
      docs: '/docs',
    });
  });

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/readyz', (_req, res, next) => {
    if (isDbConnected()) {
      res.status(200).json({ status: 'ready', database: 'connected' });
    } else {
      next(new AppError('Database not connected', 'INTERNAL_SERVER_ERROR', 503));
    }
  });

  // Mount full API v1 router
  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use((_req, _res, next) => {
    next(AppError.notFound('Resource or endpoint not found'));
  });

  // Global centralized error handler
  app.use(errorHandler);

  return app;
}
