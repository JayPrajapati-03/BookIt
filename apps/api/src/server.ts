import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents } from '@bookit/shared';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './db/connection.js';
import { logger } from './utils/logger.js';
import jwt from 'jsonwebtoken';
import { BookingService } from './services/booking.service.js';

async function bootstrap() {
  const app = createApp();
  const httpServer = http.createServer(app);

  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: [env.WEB_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    },
  });

  // Socket.io authentication handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      // Allow unauthenticated connections for public rooms (hotel viewers)
      socket.data.userId = null;
      return next();
    }
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; role: string };
      socket.data.userId = payload.sub;
      socket.data.userRole = payload.role;
      next();
    } catch {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    logger.debug({ socketId: socket.id, userId: socket.data.userId }, 'Socket connected');

    // Join hotel viewer room for presence
    socket.on('hotel:subscribe', ({ hotelId }) => {
      socket.join(`hotel:${hotelId}`);
      const roomSize = io.sockets.adapter.rooms.get(`hotel:${hotelId}`)?.size || 0;
      io.to(`hotel:${hotelId}`).emit('hotel:viewers', { hotelId, count: roomSize });
    });

    socket.on('hotel:unsubscribe', ({ hotelId }) => {
      socket.leave(`hotel:${hotelId}`);
      const roomSize = io.sockets.adapter.rooms.get(`hotel:${hotelId}`)?.size || 0;
      io.to(`hotel:${hotelId}`).emit('hotel:viewers', { hotelId, count: roomSize });
    });

    // Join personal notification room
    if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`);
    }

    socket.on('disconnect', () => {
      logger.debug({ socketId: socket.id }, 'Socket disconnected');
    });
  });

  // Export socket io for use in controllers
  app.set('io', io);

  try {
    await connectDB();
    logger.info('✅ MongoDB connected');
  } catch (err) {
    logger.warn('Initial MongoDB connection failed. Running in degraded state.');
  }

  // Hold sweeper — runs every 5 minutes
  const sweepInterval = setInterval(async () => {
    try {
      const swept = await BookingService.sweepExpiredHolds();
      if (swept > 0) {
        logger.info({ swept }, 'Swept expired booking holds');
        // Notify availability change
        io.emit('availability:changed', { hotelId: 'all' } as any);
      }
    } catch (err) {
      logger.error({ err }, 'Hold sweeper error');
    }
  }, 15 * 1000);

  httpServer.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, env: env.NODE_ENV },
      `🚀 BookIt API server listening on port ${env.PORT}`,
    );
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal. Closing gracefully...');
    clearInterval(sweepInterval);

    io.close(() => {
      logger.info('Socket.io connections closed');
    });

    httpServer.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });

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
