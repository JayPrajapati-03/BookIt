import { z } from 'zod';
import { PAYMENT_METHODS } from '../constants.js';

export const bookingQuoteSchema = z
  .object({
    hotelId: z.string().min(1, 'Hotel ID is required'),
    roomTypeId: z.string().min(1, 'Room Type ID is required'),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    guests: z
      .object({
        adults: z.number().int().min(1).default(1),
        children: z.number().int().min(0).default(0),
      })
      .strict(),
  })
  .strict();

export type BookingQuoteInput = z.infer<typeof bookingQuoteSchema>;

export const bookingHoldSchema = bookingQuoteSchema;
export type BookingHoldInput = z.infer<typeof bookingHoldSchema>;

export const bookingConfirmSchema = z
  .object({
    guestDetails: z
      .object({
        name: z.string().trim().min(2, 'Name must be at least 2 characters'),
        email: z.string().trim().toLowerCase().email('Invalid email address'),
        phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number'),
      })
      .strict(),
    paymentMethod: z.enum(PAYMENT_METHODS),
    specialRequests: z.string().trim().max(500).optional(),
  })
  .strict();

export type BookingConfirmInput = z.infer<typeof bookingConfirmSchema>;

export const bookingCancelSchema = z
  .object({
    reason: z.string().trim().min(3, 'Cancellation reason is required').max(500),
  })
  .strict();

export type BookingCancelInput = z.infer<typeof bookingCancelSchema>;

export const walkInBookingSchema = z
  .object({
    hotelId: z.string().min(1),
    roomTypeId: z.string().min(1),
    roomId: z.string().min(1),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    guests: z
      .object({
        adults: z.number().int().min(1).default(1),
        children: z.number().int().min(0).default(0),
      })
      .strict(),
    guestDetails: z
      .object({
        name: z.string().trim().min(2),
        email: z.string().trim().toLowerCase().email(),
        phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/),
      })
      .strict(),
    paymentMethod: z.enum(PAYMENT_METHODS).default('pay_at_hotel'),
    specialRequests: z.string().trim().max(500).optional(),
  })
  .strict();

export type WalkInBookingInput = z.infer<typeof walkInBookingSchema>;
