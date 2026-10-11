import { addDays, differenceInCalendarDays, differenceInHours, startOfDay } from 'date-fns';
import { PricingRule } from '../models/PricingRule.js';
import { RoomNight } from '../models/RoomNight.js';
import { Room } from '../models/Room.js';
import { RoomType, type IRoomType } from '../models/RoomType.js';
import type mongoose from 'mongoose';

/** Generate midnight-UTC Date objects for each night of a stay */
export function getStayDates(checkIn: Date, checkOut: Date): Date[] {
  const nights: Date[] = [];
  let d = startOfDay(checkIn);
  const end = startOfDay(checkOut);
  while (d < end) {
    nights.push(new Date(d));
    d = addDays(d, 1);
  }
  return nights;
}

/** Apply pricing rules to a base price and return final price per night */
export async function computeNightlyPrice(
  hotelId: string,
  roomTypeId: string,
  basePricePaise: number,
  checkIn: Date,
  nights: number,
): Promise<{ totalPricePaise: number; breakdown: { date: string; pricePaise: number }[] }> {
  const checkOut = addDays(checkIn, nights);
  const leadDays = differenceInCalendarDays(checkIn, new Date());

  const rules = await PricingRule.find({
    hotel: hotelId,
    isActive: true,
    $or: [{ roomType: null }, { roomType: roomTypeId }],
  }).sort({ priority: -1 });

  const breakdown: { date: string; pricePaise: number }[] = [];
  let total = 0;

  const stayDates = getStayDates(checkIn, checkOut);

  for (const date of stayDates) {
    let price = basePricePaise;
    const dow = date.getDay();

    for (const rule of rules) {
      // Date range check
      if (rule.validFrom && date < rule.validFrom) continue;
      if (rule.validTo && date > rule.validTo) continue;
      // Day of week check
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(dow)) continue;
      // Lead time check
      if (rule.minLeadDays !== undefined && leadDays < rule.minLeadDays) continue;
      if (rule.maxLeadDays !== undefined && leadDays > rule.maxLeadDays) continue;
      // Min nights check
      if (rule.minNights !== undefined && nights < rule.minNights) continue;

      // Apply adjustment
      if (rule.adjustmentType === 'percent') {
        price = Math.round(price * (1 + rule.adjustmentValue / 100));
      } else {
        price = Math.max(0, price + rule.adjustmentValue);
      }
      break; // Highest priority rule wins per night
    }

    breakdown.push({ date: date.toISOString().split('T')[0], pricePaise: price });
    total += price;
  }

  return { totalPricePaise: total, breakdown };
}

/** Get availability: how many rooms are free per night for a room type */
export async function getRoomTypeAvailability(
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<{ available: boolean; availableCount: number }> {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) return { available: false, availableCount: 0 };

  const stayDates = getStayDates(checkIn, checkOut);
  const rooms = await Room.find({ roomType: roomTypeId, status: 'active' });
  const roomIds = rooms.map((r) => r._id);

  if (roomIds.length === 0) return { available: false, availableCount: 0 };

  // Find all occupied nights in the date range
  const occupiedNights = await RoomNight.find({
    room: { $in: roomIds },
    date: { $in: stayDates },
    status: { $in: ['occupied', 'blocked'] },
  }).select('room date');

  // Count busy rooms (a room is busy for the entire stay if ANY night is occupied)
  const busyRoomIds = new Set(occupiedNights.map((n) => n.room.toString()));
  const availableCount = roomIds.length - busyRoomIds.size;

  return { available: availableCount > 0, availableCount };
}

/** Find one available room for booking (round-robin friendly) */
export async function findAvailableRoom(
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<mongoose.Types.ObjectId | null> {
  const stayDates = getStayDates(checkIn, checkOut);
  const rooms = await Room.find({ roomType: roomTypeId, status: 'active' }).sort({ number: 1 });

  for (const room of rooms) {
    const conflict = await RoomNight.countDocuments({
      room: room._id,
      date: { $in: stayDates },
    });
    if (conflict === 0) return room._id;
  }
  return null;
}

/** Get monthly availability calendar for a room type */
export async function getMonthlyCalendar(
  roomTypeId: string,
  year: number,
  month: number, // 1-indexed
): Promise<{ date: string; availableCount: number; pricePaise: number }[]> {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) return [];

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));
  const allDates = getStayDates(startDate, endDate);

  const rooms = await Room.find({ roomType: roomTypeId, status: 'active' });
  const roomIds = rooms.map((r) => r._id);

  const occupiedNights = await RoomNight.find({
    room: { $in: roomIds },
    date: { $in: allDates },
  }).select('room date');

  // Group occupied rooms by date
  const occupiedByDate = new Map<string, Set<string>>();
  for (const n of occupiedNights) {
    const key = n.date.toISOString().split('T')[0];
    if (!occupiedByDate.has(key)) occupiedByDate.set(key, new Set());
    occupiedByDate.get(key)!.add(n.room.toString());
  }

  const rules = await PricingRule.find({
    hotel: roomType.hotel.toString(),
    isActive: true,
    $or: [{ roomType: null }, { roomType: roomTypeId }],
  }).sort({ priority: -1 });

  const calendar = [];
  const totalRooms = rooms.length;
  const leadDays = 0;

  for (const date of allDates) {
    const dateKey = date.toISOString().split('T')[0];
    const busyCount = occupiedByDate.get(dateKey)?.size || 0;
    const availableCount = totalRooms - busyCount;

    // Compute price for that night
    let price = roomType.basePricePaise;
    const dow = date.getDay();
    for (const rule of rules) {
      if (rule.validFrom && date < rule.validFrom) continue;
      if (rule.validTo && date > rule.validTo) continue;
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(dow)) continue;
      if (rule.adjustmentType === 'percent') {
        price = Math.round(price * (1 + rule.adjustmentValue / 100));
      } else {
        price = Math.max(0, price + rule.adjustmentValue);
      }
      break;
    }

    calendar.push({ date: dateKey, availableCount, pricePaise: price });
  }

  return calendar;
}
