import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { addHours, differenceInHours, startOfDay } from 'date-fns';
import { Booking, type IBooking } from '../models/Booking.js';
import { RoomNight } from '../models/RoomNight.js';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../utils/errors.js';
import {
  computeNightlyPrice,
  findAvailableRoom,
  getRoomTypeAvailability,
  getStayDates,
} from './pricing.service.js';

const HOLD_DURATION_MINUTES = 15;

function generateReference(): string {
  return `BK${nanoid(8).toUpperCase()}`;
}

export class BookingService {
  /** GET /bookings/quote — compute price without creating anything */
  static async quote(params: {
    roomTypeId: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
  }) {
    const roomType = await RoomType.findById(params.roomTypeId);
    if (!roomType || !roomType.isActive) throw AppError.notFound('Room type not found');

    const checkIn = startOfDay(params.checkIn);
    const checkOut = startOfDay(params.checkOut);
    if (checkOut <= checkIn)
      throw new AppError('Check-out must be after check-in', 'VALIDATION_ERROR', 400);

    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);
    const { totalPricePaise, breakdown } = await computeNightlyPrice(
      roomType.hotel.toString(),
      params.roomTypeId,
      roomType.basePricePaise,
      checkIn,
      nights,
    );

    const { available, availableCount } = await getRoomTypeAvailability(
      params.roomTypeId,
      checkIn,
      checkOut,
    );

    return { totalPricePaise, breakdown, nights, available, availableCount };
  }

  /** POST /bookings/hold — reserve with a 15-min hold */
  static async hold(params: {
    guestId: string;
    roomTypeId: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children?: number;
    idempotencyKey: string;
    guestDetails?: IBooking['guestDetails'];
    isWalkIn?: boolean;
    createdBy?: string;
  }) {
    // Idempotency: return existing hold if same key
    const existing = await Booking.findOne({ idempotencyKey: params.idempotencyKey });
    if (existing) return existing;

    const checkIn = startOfDay(params.checkIn);
    const checkOut = startOfDay(params.checkOut);
    if (checkOut <= checkIn)
      throw new AppError('Check-out must be after check-in', 'VALIDATION_ERROR', 400);
    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);

    const [hotel_rt, roomType] = await Promise.all([
      RoomType.findById(params.roomTypeId).populate('hotel'),
      RoomType.findById(params.roomTypeId),
    ]);

    if (!roomType || !roomType.isActive) throw AppError.notFound('Room type not found');

    const hotel = await Hotel.findById(roomType.hotel);
    if (!hotel) throw AppError.notFound('Hotel not found');

    let guestDetails = params.guestDetails;
    if (!guestDetails && params.guestId) {
      const u = await User.findById(params.guestId);
      if (u) {
        guestDetails = { name: u.name, email: u.email, phone: '+919999999999' };
      }
    }

    // Compute price
    const { totalPricePaise } = await computeNightlyPrice(
      roomType.hotel.toString(),
      params.roomTypeId,
      roomType.basePricePaise,
      checkIn,
      nights,
    );

    const stayDates = getStayDates(checkIn, checkOut);

    // Find available room + create booking atomically in a transaction
    const session = await mongoose.startSession();
    let booking: IBooking;

    try {
      session.startTransaction();

      const roomId = await findAvailableRoom(params.roomTypeId, checkIn, checkOut);
      if (!roomId) {
        await session.abortTransaction();
        throw new AppError('No rooms available for selected dates', 'CONFLICT', 409);
      }

      // Create booking
      const reference = generateReference();
      const holdExpiresAt = addHours(new Date(), HOLD_DURATION_MINUTES / 60);

      [booking] = await Booking.create(
        [
          {
            reference,
            hotel: roomType.hotel,
            roomType: params.roomTypeId,
            room: roomId,
            guest: params.guestId,
            guestDetails: guestDetails || params.guestDetails,
            checkIn,
            checkOut,
            nights,
            adults: params.adults,
            children: params.children || 0,
            totalPricePaise,
            policySnapshot: {
              freeCancellationHours: hotel.policies.freeCancellationHours,
              lateCancellationPenaltyPercent: hotel.policies.lateCancellationPenaltyPercent,
              checkInTime: hotel.policies.checkInTime,
              checkOutTime: hotel.policies.checkOutTime,
            },
            status: 'hold',
            idempotencyKey: params.idempotencyKey,
            holdExpiresAt,
            isWalkIn: params.isWalkIn || false,
            createdBy: params.createdBy,
          },
        ],
        { session },
      );

      // Insert room nights — will throw duplicate key error on race condition
      const roomNights = stayDates.map((date) => ({
        hotel: roomType.hotel,
        roomType: params.roomTypeId,
        room: roomId,
        date,
        booking: booking._id,
        status: 'occupied',
      }));
      await RoomNight.insertMany(roomNights, { session });

      await session.commitTransaction();
    } catch (err: any) {
      await session.abortTransaction();
      if (
        err.code === 11000 ||
        err.code === 112 ||
        (typeof err.hasErrorLabel === 'function' && err.hasErrorLabel('TransientTransactionError'))
      ) {
        throw new AppError(
          'Room no longer available — please select different dates',
          'SOLD_OUT',
          409,
        );
      }
      throw err;
    } finally {
      session.endSession();
    }

    return booking!;
  }

  /** POST /bookings/:id/confirm */
  static async confirm(bookingId: string, guestId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw AppError.notFound('Booking not found');
    if (booking.guest.toString() !== guestId) throw AppError.forbidden('Access denied');
    if (booking.status !== 'hold') {
      throw new AppError(`Cannot confirm booking in status '${booking.status}'`, 'CONFLICT', 409);
    }
    if (booking.holdExpiresAt && booking.holdExpiresAt < new Date()) {
      throw new AppError('Hold has expired. Please start a new booking.', 'HOLD_EXPIRED', 410);
    }

    booking.status = 'confirmed';
    booking.holdExpiresAt = undefined;
    await booking.save();

    await AuditLog.create({
      user: guestId,
      action: 'booking.confirmed',
      resource: 'Booking',
      resourceId: bookingId,
      outcome: 'success',
      metadata: { reference: booking.reference },
    });

    return booking;
  }

  /** POST /bookings/:id/cancel */
  static async cancel(bookingId: string, actorId: string, actorRole: string, reason?: string) {
    const booking = await Booking.findById(bookingId).populate('hotel');
    if (!booking) throw AppError.notFound('Booking not found');

    const isGuest = booking.guest.toString() === actorId;
    const isStaff = ['staff', 'admin'].includes(actorRole);
    if (!isGuest && !isStaff) throw AppError.forbidden('Access denied');

    if (!['hold', 'confirmed', 'checked_in'].includes(booking.status)) {
      throw new AppError(`Cannot cancel booking in status '${booking.status}'`, 'CONFLICT', 409);
    }

    // Calculate penalty
    const hoursUntilCheckIn = differenceInHours(booking.checkIn, new Date());
    const freeHours = booking.policySnapshot.freeCancellationHours;
    let penaltyPercent = 0;
    if (hoursUntilCheckIn < freeHours) {
      penaltyPercent = booking.policySnapshot.lateCancellationPenaltyPercent;
    }
    const penaltyPaise = Math.round((booking.totalPricePaise * penaltyPercent) / 100);
    const refundPaise = booking.totalPricePaise - penaltyPaise;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      booking.status = 'cancelled';
      booking.cancellationInfo = {
        cancelledAt: new Date(),
        actor: isGuest ? 'guest' : (actorRole as any),
        reason,
        refundPaise,
        penaltyPaise,
      };
      await booking.save({ session });

      // Release room nights
      await RoomNight.deleteMany({ booking: bookingId }, { session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return booking;
  }

  /** GET /bookings — guest's own bookings */
  static async listForGuest(guestId: string, status?: string, cursor?: string, limit = 10) {
    const filter: Record<string, any> = { guest: guestId };
    if (status) filter.status = status;
    if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };

    const bookings = await Booking.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('hotel', 'name slug city images')
      .populate('roomType', 'name images');

    const hasMore = bookings.length > limit;
    const data = hasMore ? bookings.slice(0, limit) : bookings;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;

    return { bookings: data, hasMore, nextCursor };
  }

  /** Sweep expired holds — called by background job */
  static async sweepExpiredHolds() {
    const expired = await Booking.find({
      status: 'hold',
      holdExpiresAt: { $lt: new Date() },
    });

    let swept = 0;
    for (const booking of expired) {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        booking.status = 'cancelled';
        booking.cancellationInfo = {
          cancelledAt: new Date(),
          actor: 'system',
          reason: 'Hold expired',
          refundPaise: 0,
          penaltyPaise: 0,
        };
        await booking.save({ session });
        await RoomNight.deleteMany({ booking: booking._id }, { session });
        await session.commitTransaction();
        swept++;
      } catch {
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
    }
    return swept;
  }
}
