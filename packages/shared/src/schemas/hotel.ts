import { z } from 'zod';
import { PROPERTY_TYPES } from '../constants.js';

export const hotelSearchQuerySchema = z
  .object({
    q: z.string().trim().optional(),
    city: z.string().trim().optional(),
    checkIn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
      .optional(),
    checkOut: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
      .optional(),
    adults: z.coerce.number().int().min(1).default(1),
    children: z.coerce.number().int().min(0).default(0),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
    amenities: z.union([z.string().transform((val) => [val]), z.array(z.string())]).optional(),
    propertyType: z
      .union([
        z.enum(PROPERTY_TYPES).transform((val) => [val]),
        z.array(z.enum(PROPERTY_TYPES)),
      ])
      .optional(),
    minRating: z.coerce.number().min(1).max(5).optional(),
    near: z
      .string()
      .regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, 'Format must be lat,lng')
      .optional(),
    radiusKm: z.coerce.number().positive().default(50),
    sort: z
      .enum(['recommended', 'price_asc', 'price_desc', 'rating', 'distance'])
      .default('recommended'),
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type HotelSearchQuery = z.infer<typeof hotelSearchQuerySchema>;

export const hotelSuggestQuerySchema = z
  .object({
    q: z.string().trim().min(1),
  })
  .strict();

export type HotelSuggestQuery = z.infer<typeof hotelSuggestQuerySchema>;
