import type { Request, Response, NextFunction } from 'express';
import { HotelService } from '../services/hotel.service.js';
import { hotelSearchQuerySchema, hotelSuggestQuerySchema } from '@bookit/shared';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { AppError } from '../utils/errors.js';
import { getRoomTypeAvailability, getMonthlyCalendar } from '../services/pricing.service.js';

export async function searchHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const query = hotelSearchQuerySchema.parse(req.query);
    const result = await HotelService.search(query);
    res.json({ data: result.hotels, meta: { total: result.total, facets: result.facets } });
  } catch (err) {
    next(err);
  }
}

export async function suggestHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = hotelSuggestQuerySchema.parse(req.query);
    const result = await HotelService.suggest(q);
    res.json({ data: result.suggestions });
  } catch (err) {
    next(err);
  }
}

export async function getHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await HotelService.getBySlug(req.params.slug as string);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getHotelAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug, status: 'published' });
    if (!hotel) return next(AppError.notFound('Hotel not found'));

    const checkIn = new Date(req.query.checkIn as string);
    const checkOut = new Date(req.query.checkOut as string);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return next(new AppError('Invalid dates', 'VALIDATION_ERROR', 400));
    }

    const roomTypes = await RoomType.find({ hotel: hotel._id, isActive: true }).sort({
      basePricePaise: 1,
    });
    const availability = await Promise.all(
      roomTypes.map(async (rt) => {
        const avail = await getRoomTypeAvailability(rt._id.toString(), checkIn, checkOut);
        return { roomTypeId: rt._id, name: rt.name, ...avail };
      }),
    );

    res.json({ data: { availability } });
  } catch (err) {
    next(err);
  }
}

export async function getHotelCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomTypeId, year, month } = req.query;
    if (!roomTypeId || !year || !month) {
      return next(new AppError('roomTypeId, year, month required', 'VALIDATION_ERROR', 400));
    }
    const calendar = await getMonthlyCalendar(String(roomTypeId), Number(year), Number(month));
    res.json({ data: { calendar } });
  } catch (err) {
    next(err);
  }
}

// Legacy class export for backward compat
export class HotelController {
  static search = searchHotels;
  static getBySlug = getHotel;
  static suggest = suggestHotels;
}
