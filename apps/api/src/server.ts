import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents } from '@bookit/shared';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './db/connection.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  const app = createApp();
  const httpServer = http.createServer(app);

  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: [env.WEB_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    },
  });

  // Export or attach io instance if needed
  app.set('io', io);

  try {
    // Attempt database connection
    await connectDB();
  } catch (err) {
    logger.warn('Initial MongoDB connection failed. Running in degraded state.');
  }

  httpServer.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, `🚀 BookIt API server listening on port ${env.PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal. Closing gracefully...');

    io.close(() => {
      logger.info('Socket.io connections closed');
    });

    httpServer.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10 seconds if hanging
    setTimeout(() => {
      logger.error('Forced shutdown timeout exceeded.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start BookIt server');
  process.exit(1);
});
