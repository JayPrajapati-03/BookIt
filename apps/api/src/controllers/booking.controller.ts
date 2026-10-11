import type { Request, Response, NextFunction } from 'express';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { Room } from '../models/Room.js';
import { PricingRule } from '../models/PricingRule.js';
import { BookingService } from '../services/booking.service.js';

import { AppError } from '../utils/errors.js';

/** GET /hotels */
export async function searchHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { HotelService } = await import('../services/hotel.service.js');
    const result = await HotelService.search(req.query as any);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/** GET /hotels/suggest */
export async function suggestHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { HotelService } = await import('../services/hotel.service.js');
    const result = await HotelService.suggest(String(req.query.q || ''));
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/** GET /hotels/:slug */
export async function getHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const { HotelService } = await import('../services/hotel.service.js');
    const result = await HotelService.getBySlug(req.params.slug as string);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/** GET /hotels/:slug/availability?checkIn=&checkOut= */
export async function getHotelAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { getRoomTypeAvailability } = await import('../services/pricing.service.js');
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

/** GET /hotels/:slug/calendar?roomTypeId=&year=&month= */
export async function getHotelCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const { getMonthlyCalendar } = await import('../services/pricing.service.js');
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

/** GET / POST /bookings/quote */
export async function quoteBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const roomTypeId = req.body?.roomTypeId || req.query.roomTypeId;
    const checkIn = req.body?.checkIn || req.query.checkIn;
    const checkOut = req.body?.checkOut || req.query.checkOut;
    const adults = req.body?.guests?.adults || req.body?.adults || req.query.adults;
    if (!roomTypeId || !checkIn || !checkOut) {
      return next(new AppError('roomTypeId, checkIn, checkOut required', 'VALIDATION_ERROR', 400));
    }
    const result = await BookingService.quote({
      roomTypeId: String(roomTypeId),
      checkIn: new Date(String(checkIn)),
      checkOut: new Date(String(checkOut)),
      adults: Number(adults) || 1,
    });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/** POST /bookings/hold */
export async function holdBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomTypeId, checkIn, checkOut, adults, children, guestDetails } = req.body;
    const idempotencyKey = (req.headers['idempotency-key'] as string) || req.body.idempotencyKey;

    if (!roomTypeId || !checkIn || !checkOut || !idempotencyKey) {
      return next(
        new AppError(
          'roomTypeId, checkIn, checkOut, idempotencyKey required',
          'VALIDATION_ERROR',
          400,
        ),
      );
    }

    const booking = await BookingService.hold({
      guestId: req.user!.id,
      roomTypeId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults: adults || 1,
      children: children || 0,
      idempotencyKey,
      guestDetails: guestDetails || {
        name: req.user!.name,
        email: req.user!.email,
      },
    });

    res.status(201).json({ data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** POST /bookings/:id/confirm */
export async function confirmBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await BookingService.confirm(req.params.id as string, req.user!.id);
    res.json({ data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** POST /bookings/:id/cancel */
export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await BookingService.cancel(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
      req.body.reason,
    );
    res.json({ data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** GET /bookings */
export async function listBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, cursor, limit } = req.query;
    const result = await BookingService.listForGuest(
      req.user!.id,
      status as string,
      cursor as string,
      Number(limit) || 10,
    );
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/** GET /bookings/:id */
export async function getBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { Booking } = await import('../models/Booking.js');
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'name slug city images policies')
      .populate('roomType', 'name images beds maxGuests');
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.guest.toString() !== req.user!.id && !['staff', 'admin'].includes(req.user!.role)) {
      return next(AppError.forbidden('Access denied'));
    }
    res.json({ data: { booking } });
  } catch (err) {
    next(err);
  }
}
