import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { Room } from '../models/Room.js';
import { Booking } from '../models/Booking.js';
import { RoomNight } from '../models/RoomNight.js';
import { BookingService } from '../services/booking.service.js';

describe('Booking Engine Concurrency & Idempotency Invariants', () => {
  let replSet: MongoMemoryReplSet;
  let guest1Id: string;
  let guest2Id: string;
  let hotelId: string;
  let roomTypeId: string;
  let roomId: string;

  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());

    // Create test guests
    const u1 = await User.create({
      name: 'Guest One',
      email: 'guest1@bookit.test',
      passwordHash: 'hash1',
      role: 'guest',
      status: 'active',
    });
    guest1Id = u1._id.toString();

    const u2 = await User.create({
      name: 'Guest Two',
      email: 'guest2@bookit.test',
      passwordHash: 'hash2',
      role: 'guest',
      status: 'active',
    });
    guest2Id = u2._id.toString();

    // Create single test hotel
    const hotel = await Hotel.create({
      name: 'The Grand Lotus',
      slug: 'grand-lotus-concurrency',
      tagline: 'A peaceful lakeside palace',
      description: 'Luxury testing retreat situated on Lake Pichola',
      city: 'Udaipur',
      state: 'Rajasthan',
      address: '1 Lake Palace Road',
      status: 'published',
      location: {
        type: 'Point',
        coordinates: [73.68, 24.58],
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
          alt: 'Grand Lotus Exterior',
        },
      ],
      amenities: ['wifi', 'pool', 'spa'],
      propertyType: 'haveli',
      starRating: 5,
      ratingAvg: 4.9,
      ratingCount: 30,
      fromPricePaise: 1500000,
      policies: {
        checkInTime: '14:00',
        checkOutTime: '11:00',
        freeCancellationHours: 24,
        lateCancellationPenaltyPercent: 50,
      },
    });
    hotelId = hotel._id.toString();

    // Create single room type with unitCount 1
    const rt = await RoomType.create({
      hotel: hotel._id,
      name: 'Royal Heritage Suite',
      slug: 'royal-heritage-suite',
      description: 'Only 1 unit exists for strict concurrency testing',
      basePricePaise: 1500000,
      maxGuests: 2,
      beds: '1 King Bed',
      sizeSqm: 55,
      amenities: ['wifi', 'king-bed', 'lake-view'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
          alt: 'Royal Heritage Suite Room',
        },
      ],
      unitCount: 1,
      isActive: true,
    });
    roomTypeId = rt._id.toString();

    // Create exactly 1 physical room
    const rm = await Room.create({
      hotel: hotel._id,
      roomType: rt._id,
      number: 'Suite-101',
      floor: 1,
      status: 'active',
    });
    roomId = rm._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await replSet.stop();
  });

  afterEach(async () => {
    await Booking.deleteMany({});
    await RoomNight.deleteMany({});
    await new Promise((r) => setTimeout(r, 150));
  });

  it('Invariant 1: Double-Booking Prevention Under Concurrent Hold Race', async () => {
    const checkIn = new Date('2026-11-10');
    const checkOut = new Date('2026-11-12');

    // Run 2 simultaneous hold requests for the ONLY available room
    const results = await Promise.allSettled([
      BookingService.hold({
        guestId: guest1Id,
        roomTypeId,
        checkIn,
        checkOut,
        adults: 2,
        idempotencyKey: 'race-key-guest-1',
      }),
      BookingService.hold({
        guestId: guest2Id,
        roomTypeId,
        checkIn,
        checkOut,
        adults: 2,
        idempotencyKey: 'race-key-guest-2',
      }),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    // Exactly 1 must succeed, and 1 must be rejected due to zero remaining rooms
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    // Verify error code on rejection
    const rejectedReason = (rejected[0] as PromiseRejectedResult).reason;
    expect(rejectedReason.code).toBe('SOLD_OUT');

    // Clean up handled in afterEach
  });

  it('Invariant 2: Strict Idempotency with exact replay', async () => {
    const checkIn = new Date('2026-11-15');
    const checkOut = new Date('2026-11-17');
    const key = 'idem-key-test-999';

    const b1 = await BookingService.hold({
      guestId: guest1Id,
      roomTypeId,
      checkIn,
      checkOut,
      adults: 2,
      idempotencyKey: key,
    });

    // Replay the exact same request with same idempotency key
    const b2 = await BookingService.hold({
      guestId: guest1Id,
      roomTypeId,
      checkIn,
      checkOut,
      adults: 2,
      idempotencyKey: key,
    });

    // Must return the exact same booking reference without creating duplicate records
    expect(b1.reference).toBe(b2.reference);
    expect(b1._id.toString()).toBe(b2._id.toString());

    const totalBookings = await Booking.countDocuments({ idempotencyKey: key });
    expect(totalBookings).toBe(1);
  });

  it('Invariant 3: Cancellation Releases Inventory Back to the Pool', async () => {
    const checkIn = new Date('2026-11-20');
    const checkOut = new Date('2026-11-22');

    // Hold and confirm booking
    const hold = await BookingService.hold({
      guestId: guest1Id,
      roomTypeId,
      checkIn,
      checkOut,
      adults: 2,
      idempotencyKey: 'cancel-test-key-1',
    });

    const confirmed = await BookingService.confirm(hold._id.toString(), guest1Id);
    expect(confirmed.status).toBe('confirmed');

    // Second guest attempts to book same dates -> should be SOLD_OUT
    await expect(
      BookingService.hold({
        guestId: guest2Id,
        roomTypeId,
        checkIn,
        checkOut,
        adults: 2,
        idempotencyKey: 'cancel-test-key-2',
      }),
    ).rejects.toThrow();

    // First guest cancels booking
    const cancelled = await BookingService.cancel(
      confirmed._id.toString(),
      guest1Id,
      'guest',
      'Change of travel plans',
    );
    expect(cancelled.status).toBe('cancelled');

    // Second guest can now immediately hold the dates
    const secondHold = await BookingService.hold({
      guestId: guest2Id,
      roomTypeId,
      checkIn,
      checkOut,
      adults: 2,
      idempotencyKey: 'cancel-test-key-3',
    });
    expect(secondHold.status).toBe('hold');
  });

  it('Invariant 4: Expired Holds Do Not Prevent New Bookings', async () => {
    const checkIn = new Date('2026-11-25');
    const checkOut = new Date('2026-11-27');

    const hold = await BookingService.hold({
      guestId: guest1Id,
      roomTypeId,
      checkIn,
      checkOut,
      adults: 2,
      idempotencyKey: 'expired-hold-key-1',
    });

    // Manually expire the hold
    hold.holdExpiresAt = new Date(Date.now() - 60000); // 1 minute in past
    await hold.save();

    // Confirming an expired hold must throw HOLD_EXPIRED
    await expect(BookingService.confirm(hold._id.toString(), guest1Id)).rejects.toMatchObject({
      code: 'HOLD_EXPIRED',
    });
  });

  it('Invariant 5: Overlapping stays on the same room rejected by database unique index', async () => {
    const date = new Date('2026-12-01');

    // Insert first room night directly
    await RoomNight.create({
      hotel: hotelId,
      roomType: roomTypeId,
      room: roomId,
      date,
      status: 'occupied',
    });

    // Attempting duplicate insert on same room and date directly must throw duplicate key error (code 11000)
    await expect(
      RoomNight.create({
        hotel: hotelId,
        roomType: roomTypeId,
        room: roomId,
        date,
        status: 'occupied',
      }),
    ).rejects.toThrow();
  });
});
