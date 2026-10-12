import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { hotelRouter } from './hotel.routes.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  quoteBooking,
  holdBooking,
  confirmBooking,
  cancelBooking,
  listBookings,
  getBooking,
} from '../controllers/booking.controller.js';
import { createReview, respondToReview } from '../controllers/review.controller.js';
import { getWishlist, toggleWishlist, checkWishlist } from '../controllers/wishlist.controller.js';
import {
  getDashboard,
  adminListBookings,
  updateBookingStatus,
  createWalkIn,
  getTapeChart,
  adminListUsers,
  updateUserRole,
  getAuditLogs,
  getOccupancyReport,
  adminListHotels,
  adminCreateHotel,
  adminUpdateHotel,
  adminListRoomTypes,
  adminCreateRoomType,
  adminListPricingRules,
  adminCreatePricingRule,
  adminUpdatePricingRule,
  adminDeletePricingRule,
  createBlock,
  updateSettings,
} from '../controllers/admin.controller.js';

const apiRouter: Router = Router();

apiRouter.get('/ping', (_req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// Hotels & Search (public)
apiRouter.use('/hotels', hotelRouter);

// Auth
apiRouter.use('/auth', authRouter);

// ─── Guest / User Routes ───────────────────────────────────────────────────
apiRouter.get('/bookings/quote', authenticate, authorize('bookings:create'), quoteBooking);
apiRouter.post('/bookings/quote', authenticate, authorize('bookings:create'), quoteBooking);
apiRouter.post('/bookings/hold', authenticate, authorize('bookings:create'), holdBooking);
apiRouter.post('/bookings/:id/confirm', authenticate, authorize('bookings:create'), confirmBooking);
apiRouter.post('/bookings/:id/cancel', authenticate, authorize('bookings:read:own'), cancelBooking);
apiRouter.get('/bookings', authenticate, authorize('bookings:read:own'), listBookings);
apiRouter.get('/bookings/:id', authenticate, authorize('bookings:read:own'), getBooking);

apiRouter.post('/reviews', authenticate, authorize('reviews:create'), createReview);

apiRouter.get('/wishlist', authenticate, authorize('wishlist:manage:own'), getWishlist);
apiRouter.post('/wishlist/toggle', authenticate, authorize('wishlist:manage:own'), toggleWishlist);
apiRouter.get('/wishlist/check', authenticate, authorize('wishlist:manage:own'), checkWishlist);

// ─── Staff & Admin Routes ──────────────────────────────────────────────────
apiRouter.post('/admin/walk-in', authenticate, authorize('bookings:walk_in'), createWalkIn);
apiRouter.patch(
  '/admin/bookings/:id/status',
  authenticate,
  authorize('bookings:update:status'),
  updateBookingStatus,
);
apiRouter.post('/admin/blocks', authenticate, authorize('blocks:manage'), createBlock);
apiRouter.post(
  '/admin/reviews/:id/respond',
  authenticate,
  authorize('reviews:respond'),
  respondToReview,
);
apiRouter.get('/admin/tape-chart', authenticate, authorize('bookings:update:status'), getTapeChart);

// ─── Admin-Only Routes ─────────────────────────────────────────────────────
apiRouter.get('/admin/dashboard', authenticate, authorize('reports:read'), getDashboard);
apiRouter.get(
  '/admin/bookings',
  authenticate,
  authorize('bookings:update:status'),
  adminListBookings,
);
apiRouter.get('/admin/users', authenticate, authorize('users:manage'), adminListUsers);
apiRouter.patch('/admin/users/:id/role', authenticate, authorize('users:manage'), updateUserRole);
apiRouter.get('/admin/audit-logs', authenticate, authorize('audit:read'), getAuditLogs);
apiRouter.get(
  '/admin/reports/occupancy',
  authenticate,
  authorize('reports:read'),
  getOccupancyReport,
);

apiRouter.get('/admin/hotels', authenticate, authorize('hotels:read'), adminListHotels);
apiRouter.post('/admin/hotels', authenticate, authorize('hotels:manage'), adminCreateHotel);
apiRouter.patch('/admin/hotels/:id', authenticate, authorize('hotels:manage'), adminUpdateHotel);

apiRouter.get('/admin/room-types', authenticate, authorize('hotels:manage'), adminListRoomTypes);
apiRouter.post('/admin/room-types', authenticate, authorize('hotels:manage'), adminCreateRoomType);

apiRouter.get(
  '/admin/pricing-rules',
  authenticate,
  authorize('pricing:manage'),
  adminListPricingRules,
);
apiRouter.post(
  '/admin/pricing-rules',
  authenticate,
  authorize('pricing:manage'),
  adminCreatePricingRule,
);
apiRouter.patch(
  '/admin/pricing-rules/:id',
  authenticate,
  authorize('pricing:manage'),
  adminUpdatePricingRule,
);
apiRouter.delete(
  '/admin/pricing-rules/:id',
  authenticate,
  authorize('pricing:manage'),
  adminDeletePricingRule,
);
apiRouter.patch('/admin/settings', authenticate, authorize('settings:manage'), updateSettings);

export { apiRouter };
