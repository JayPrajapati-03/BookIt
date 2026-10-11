import type { Request, Response, NextFunction } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Hotel } from '../models/Hotel.js';
import { AppError } from '../utils/errors.js';

/** GET /wishlist */
export async function getWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Wishlist.find({ user: req.user!.id }).populate(
      'hotel',
      'name slug city images starRating ratingAvg fromPricePaise propertyType',
    );
    res.json({ data: { items } });
  } catch (err) {
    next(err);
  }
}

/** POST /wishlist/toggle */
export async function toggleWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.body;
    if (!hotelId) return next(new AppError('hotelId required', 'VALIDATION_ERROR', 400));

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return next(AppError.notFound('Hotel not found'));

    const existing = await Wishlist.findOne({ user: req.user!.id, hotel: hotelId });
    if (existing) {
      await existing.deleteOne();
      res.json({ data: { saved: false } });
    } else {
      await Wishlist.create({ user: req.user!.id, hotel: hotelId });
      res.json({ data: { saved: true } });
    }
  } catch (err) {
    next(err);
  }
}

/** GET /wishlist/check?hotelId= */
export async function checkWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.query;
    if (!hotelId) return next(new AppError('hotelId required', 'VALIDATION_ERROR', 400));
    const exists = await Wishlist.exists({ user: req.user!.id, hotel: hotelId });
    res.json({ data: { saved: !!exists } });
  } catch (err) {
    next(err);
  }
}
