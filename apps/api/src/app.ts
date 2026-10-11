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

  // Swagger Documentation & OpenAPI Spec
  app.get('/docs/openapi.json', (_req, res) => {
    import('path').then((path) => {
      const openApiPath = path.resolve(process.cwd(), 'docs/openapi.json');
      res.sendFile(openApiPath);
    });
  });

  app.get('/docs', (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>BookIt API — Interactive Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>body { margin: 0; background: #fafafa; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
      });
    };
  </script>
</body>
</html>`);
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
