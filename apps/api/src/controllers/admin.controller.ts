import type { Request, Response, NextFunction } from 'express';
import { Booking } from '../models/Booking.js';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { Room } from '../models/Room.js';
import { PricingRule } from '../models/PricingRule.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { Review } from '../models/Review.js';
import { RoomNight } from '../models/RoomNight.js';
import { BookingService } from '../services/booking.service.js';
import { AppError } from '../utils/errors.js';
import { startOfDay, subDays, format } from 'date-fns';

/** GET /admin/dashboard — KPIs */
export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalBookings,
      confirmedToday,
      arrivalsToday,
      departuresToday,
      occupiedNights,
      totalRooms,
      recentActivity,
    ] = await Promise.all([
      Booking.countDocuments({ status: { $in: ['confirmed', 'checked_in', 'checked_out'] } }),
      Booking.countDocuments({ status: 'confirmed', createdAt: { $gte: today } }),
      Booking.countDocuments({ status: 'confirmed', checkIn: { $gte: today, $lt: tomorrow } }),
      Booking.countDocuments({ status: 'checked_in', checkOut: { $gte: today, $lt: tomorrow } }),
      RoomNight.countDocuments({ date: today, status: 'occupied' }),
      Room.countDocuments({ status: 'active' }),
      AuditLog.find().sort({ at: -1 }).limit(10).populate('actor', 'name email'),
    ]);

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedNights / totalRooms) * 100) : 0;

    // Revenue (last 30 days)
    const thirtyDaysAgo = subDays(today, 30);
    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'checked_in', 'checked_out'] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPricePaise' }, count: { $sum: 1 } } },
    ]);

    const revenue30d = revenueAgg[0]?.total || 0;
    const adr = revenueAgg[0]?.count ? Math.round(revenue30d / revenueAgg[0].count) : 0;

    res.json({
      data: {
        kpis: {
          totalBookings,
          confirmedToday,
          arrivalsToday,
          departuresToday,
          occupancyRate,
          revenue30dPaise: revenue30d,
          adrPaise: adr,
        },
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/bookings — all bookings with filters */
export async function adminListBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, hotelId, checkIn, checkOut, search, cursor, limit } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (hotelId) filter.hotel = hotelId;
    if (checkIn) filter.checkIn = { $gte: new Date(String(checkIn)) };
    if (checkOut) filter.checkOut = { $lte: new Date(String(checkOut)) };
    if (search) {
      filter.$or = [
        { reference: { $regex: String(search), $options: 'i' } },
        { 'guestDetails.name': { $regex: String(search), $options: 'i' } },
        { 'guestDetails.email': { $regex: String(search), $options: 'i' } },
      ];
    }
    if (cursor) filter._id = { $lt: cursor };

    const pageLimit = Number(limit) || 20;
    const bookings = await Booking.find(filter)
      .sort({ _id: -1 })
      .limit(pageLimit + 1)
      .populate('hotel', 'name slug city')
      .populate('roomType', 'name')
      .populate('guest', 'name email');

    const hasMore = bookings.length > pageLimit;
    const data = hasMore ? bookings.slice(0, pageLimit) : bookings;

    res.json({
      data: {
        bookings: data,
        hasMore,
        nextCursor: hasMore ? data[data.length - 1]._id : null,
        total: await Booking.countDocuments(filter),
      },
    });
  } catch (err) {
    next(err);
  }
}

/** PATCH /admin/bookings/:id/status */
export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'checked_in', 'checked_out', 'no_show', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 'VALIDATION_ERROR', 400));
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return next(AppError.notFound('Booking not found'));

    await AuditLog.create({
      user: req.user!.id,
      action: `booking.status.${status}`,
      resource: 'Booking',
      resourceId: req.params.id,
      outcome: 'success',
      metadata: { reference: booking.reference, newStatus: status },
    });

    res.json({ data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** POST /admin/walk-in */
export async function createWalkIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { nanoid } = await import('nanoid');
    const { roomTypeId, checkIn, checkOut, adults, children, guestDetails } = req.body;
    if (!roomTypeId || !checkIn || !checkOut || !guestDetails) {
      return next(
        new AppError(
          'roomTypeId, checkIn, checkOut, guestDetails required',
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
      idempotencyKey: `walkin-${nanoid(10)}`,
      guestDetails,
      isWalkIn: true,
      createdBy: req.user!.id,
    });

    // Auto-confirm walk-ins
    const confirmed = await BookingService.confirm(booking._id.toString(), req.user!.id);
    res.status(201).json({ data: { booking: confirmed } });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/tape-chart?hotelId=&startDate=&days= */
export async function getTapeChart(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId, startDate, days } = req.query;
    if (!hotelId || !startDate) {
      return next(new AppError('hotelId and startDate required', 'VALIDATION_ERROR', 400));
    }

    const start = startOfDay(new Date(String(startDate)));
    const numDays = Number(days) || 14;

    const dateRange: Date[] = [];
    for (let i = 0; i < numDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dateRange.push(d);
    }

    const rooms = await Room.find({ hotel: hotelId, status: 'active' })
      .populate('roomType', 'name')
      .sort({ number: 1 });

    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + numDays);

    const bookings = await Booking.find({
      hotel: hotelId,
      status: { $in: ['confirmed', 'checked_in', 'checked_out'] },
      $or: [{ checkIn: { $lt: endDate }, checkOut: { $gt: start } }],
    })
      .populate('guest', 'name')
      .select('reference checkIn checkOut status room guestDetails guest nights totalPricePaise');

    res.json({ data: { rooms, bookings, dateRange: dateRange.map((d) => d.toISOString()) } });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/users */
export async function adminListUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, role, cursor, limit } = req.query;
    const filter: Record<string, any> = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
      ];
    }
    if (cursor) filter._id = { $lt: cursor };

    const pageLimit = Number(limit) || 20;
    const users = await User.find(filter)
      .sort({ _id: -1 })
      .limit(pageLimit + 1)
      .select('-passwordHash');
    const hasMore = users.length > pageLimit;
    const data = hasMore ? users.slice(0, pageLimit) : users;

    res.json({
      data: { users: data, hasMore, nextCursor: hasMore ? data[data.length - 1]._id : null },
    });
  } catch (err) {
    next(err);
  }
}

/** PATCH /admin/users/:id/role */
export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.params.id === req.user!.id) {
      return next(new AppError('Cannot change your own role', 'FORBIDDEN', 403));
    }

    const admins = await User.countDocuments({ role: 'admin' });
    const target = await User.findById(req.params.id);
    if (!target) return next(AppError.notFound('User not found'));

    if (target.role === 'admin' && admins <= 1) {
      return next(new AppError('Cannot demote the last admin', 'FORBIDDEN', 403));
    }

    target.role = req.body.role;
    await target.save();

    res.json({ data: { user: target } });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/audit-logs */
export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { cursor, limit } = req.query;
    const filter: Record<string, any> = {};
    if (cursor) filter._id = { $lt: cursor };

    const pageLimit = Number(limit) || 20;
    const logs = await AuditLog.find(filter)
      .sort({ _id: -1 })
      .limit(pageLimit + 1)
      .populate('actor', 'name email');

    const hasMore = logs.length > pageLimit;
    const data = hasMore ? logs.slice(0, pageLimit) : logs;

    res.json({
      data: { logs: data, hasMore, nextCursor: hasMore ? data[data.length - 1]._id : null },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/reports/occupancy */
export async function getOccupancyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.query;
    const start = from ? new Date(String(from)) : subDays(new Date(), 30);
    const end = to ? new Date(String(to)) : new Date();

    const [byStatus, byHotel, dailyRevenue] = await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalPricePaise' } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: { $in: ['confirmed', 'checked_in', 'checked_out'] },
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: '$hotel', count: { $sum: 1 }, revenue: { $sum: '$totalPricePaise' } } },
        { $lookup: { from: 'hotels', localField: '_id', foreignField: '_id', as: 'hotel' } },
        { $unwind: '$hotel' },
        { $project: { _id: 1, count: 1, revenue: 1, 'hotel.name': 1, 'hotel.city': 1 } },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: { $in: ['confirmed', 'checked_in', 'checked_out'] },
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            revenue: { $sum: '$totalPricePaise' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ data: { byStatus, byHotel, dailyRevenue } });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/hotels */
export async function adminListHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const hotels = await Hotel.find()
      .sort({ name: 1 })
      .select('name slug city status starRating ratingAvg fromPricePaise');
    res.json({ data: { hotels } });
  } catch (err) {
    next(err);
  }
}

/** POST /admin/hotels */
export async function adminCreateHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ data: { hotel } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /admin/hotels/:id */
export async function adminUpdateHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) return next(AppError.notFound('Hotel not found'));
    res.json({ data: { hotel } });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/room-types?hotelId= */
export async function adminListRoomTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: Record<string, any> = {};
    if (req.query.hotelId) filter.hotel = req.query.hotelId;
    const roomTypes = await RoomType.find(filter).populate('hotel', 'name slug');
    res.json({ data: { roomTypes } });
  } catch (err) {
    next(err);
  }
}

/** POST /admin/room-types */
export async function adminCreateRoomType(req: Request, res: Response, next: NextFunction) {
  try {
    const roomType = await RoomType.create(req.body);
    res.status(201).json({ data: { roomType } });
  } catch (err) {
    next(err);
  }
}

/** GET /admin/pricing-rules?hotelId= */
export async function adminListPricingRules(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: Record<string, any> = {};
    if (req.query.hotelId) filter.hotel = req.query.hotelId;
    const rules = await PricingRule.find(filter)
      .populate('hotel', 'name')
      .populate('roomType', 'name');
    res.json({ data: { rules } });
  } catch (err) {
    next(err);
  }
}

/** POST /admin/pricing-rules */
export async function adminCreatePricingRule(req: Request, res: Response, next: NextFunction) {
  try {
    const rule = await PricingRule.create(req.body);
    res.status(201).json({ data: { rule } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /admin/pricing-rules/:id */
export async function adminUpdatePricingRule(req: Request, res: Response, next: NextFunction) {
  try {
    const rule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) return next(AppError.notFound('Pricing rule not found'));
    res.json({ data: { rule } });
  } catch (err) {
    next(err);
  }
}

/** DELETE /admin/pricing-rules/:id */
export async function adminDeletePricingRule(req: Request, res: Response, next: NextFunction) {
  try {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
}

/** POST /admin/blocks — maintenance block */
export async function createBlock(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomId, dates, reason } = req.body;
    if (!roomId || !dates || !Array.isArray(dates)) {
      return next(new AppError('roomId and dates[] required', 'VALIDATION_ERROR', 400));
    }

    const room = await Room.findById(roomId).populate('hotel').populate('roomType');
    if (!room) return next(AppError.notFound('Room not found'));

    const nightDocs = dates.map((d: string) => ({
      hotel: room.hotel,
      roomType: room.roomType,
      room: room._id,
      date: new Date(d),
      status: 'blocked',
    }));

    await RoomNight.insertMany(nightDocs, { ordered: false }).catch(() => {});
    res.status(201).json({ data: { blocked: dates.length, reason } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /admin/settings */
export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: { updated: true, settings: req.body } });
  } catch (err) {
    next(err);
  }
}
