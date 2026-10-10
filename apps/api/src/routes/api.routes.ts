import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const apiRouter: Router = Router();

apiRouter.get('/ping', (_req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

apiRouter.use('/auth', authRouter);

// Guest / User Authenticated Routes
apiRouter.get('/bookings', authenticate, authorize('bookings:read:own'), (_req, res) => {
  res.json({ data: [] });
});

apiRouter.post('/bookings/quote', authenticate, authorize('bookings:create'), (_req, res) => {
  res.json({ data: { quote: true } });
});

apiRouter.post('/bookings/hold', authenticate, authorize('bookings:create'), (_req, res) => {
  res.json({ data: { held: true } });
});

apiRouter.post('/reviews', authenticate, authorize('reviews:create'), (_req, res) => {
  res.json({ data: { created: true } });
});

apiRouter.get('/wishlist', authenticate, authorize('wishlist:manage:own'), (_req, res) => {
  res.json({ data: [] });
});

// Admin & Staff Routes
apiRouter.post('/admin/walk-in', authenticate, authorize('bookings:walk_in'), (_req, res) => {
  res.json({ data: { success: true } });
});

apiRouter.patch(
  '/admin/bookings/:id/status',
  authenticate,
  authorize('bookings:update:status'),
  (_req, res) => {
    res.json({ data: { updated: true } });
  },
);

apiRouter.post('/admin/blocks', authenticate, authorize('blocks:manage'), (_req, res) => {
  res.json({ data: { blocked: true } });
});

apiRouter.post(
  '/admin/reviews/:id/respond',
  authenticate,
  authorize('reviews:respond'),
  (_req, res) => {
    res.json({ data: { responded: true } });
  },
);

// Admin-Only Routes
apiRouter.post('/admin/hotels', authenticate, authorize('hotels:manage'), (_req, res) => {
  res.json({ data: { created: true } });
});

apiRouter.post(
  '/admin/pricing-rules',
  authenticate,
  authorize('pricing:manage'),
  (_req, res) => {
    res.json({ data: { created: true } });
  },
);

apiRouter.get('/admin/audit-logs', authenticate, authorize('audit:read'), (_req, res) => {
  res.json({ data: [] });
});

apiRouter.get('/admin/reports/occupancy', authenticate, authorize('reports:read'), (_req, res) => {
  res.json({ data: { occupancy: 0.85 } });
});

apiRouter.patch('/admin/settings', authenticate, authorize('settings:manage'), (_req, res) => {
  res.json({ data: { updated: true } });
});

apiRouter.get('/admin/users', authenticate, authorize('users:manage'), (_req, res) => {
  res.json({ data: [] });
});

export { apiRouter };
