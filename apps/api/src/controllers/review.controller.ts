import type { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Hotel } from '../models/Hotel.js';
import { AppError } from '../utils/errors.js';

/** POST /reviews */
export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId, rating, title, body, categories } = req.body;
    if (!bookingId || !rating || !title || !body) {
      return next(new AppError('bookingId, rating, title, body required', 'VALIDATION_ERROR', 400));
    }

    // Verify the booking belongs to this guest and is checked out
    const booking = await Booking.findById(bookingId);
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.guest.toString() !== req.user!.id) return next(AppError.forbidden('Access denied'));
    if (booking.status !== 'checked_out') {
      return next(new AppError('Reviews can only be submitted after checkout', 'FORBIDDEN', 403));
    }

    // Check for existing review
    const exists = await Review.findOne({ booking: bookingId });
    if (exists) return next(new AppError('You have already reviewed this stay', 'CONFLICT', 409));

    const review = await Review.create({
      hotel: booking.hotel,
      booking: bookingId,
      author: req.user!.id,
      rating,
      title,
      body,
      categories: categories || {},
    });

    // Update hotel rating average
    const stats = await Review.aggregate([
      { $match: { hotel: booking.hotel, isPublished: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats[0]) {
      await Hotel.findByIdAndUpdate(booking.hotel, {
        ratingAvg: Math.round(stats[0].avg * 10) / 10,
        ratingCount: stats[0].count,
      });
    }

    res.status(201).json({ data: { review } });
  } catch (err) {
    next(err);
  }
}

/** GET /hotels/:slug/reviews */
export async function getHotelReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug });
    if (!hotel) return next(AppError.notFound('Hotel not found'));

    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor as string;
    const filter: Record<string, any> = { hotel: hotel._id, isPublished: true };
    if (cursor) filter._id = { $lt: cursor };

    const reviews = await Review.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('author', 'name');

    const hasMore = reviews.length > limit;
    const data = hasMore ? reviews.slice(0, limit) : reviews;

    res.json({
      data: { reviews: data, hasMore, nextCursor: hasMore ? data[data.length - 1]._id : null },
    });
  } catch (err) {
    next(err);
  }
}

/** POST /admin/reviews/:id/respond */
export async function respondToReview(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(AppError.notFound('Review not found'));

    review.staffResponse = {
      body: req.body.body,
      respondedAt: new Date(),
      respondedBy: req.user!.id as any,
    };
    await review.save();

    res.json({ data: { review } });
  } catch (err) {
    next(err);
  }
}
