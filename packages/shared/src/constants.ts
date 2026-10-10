export const PROPERTY_TYPES = [
  'haveli',
  'resort',
  'lodge',
  'camp',
  'boutique',
  'homestay',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const HOTEL_STATUSES = ['draft', 'published', 'archived'] as const;
export type HotelStatus = (typeof HOTEL_STATUSES)[number];

export const ROOM_STATUSES = ['active', 'out_of_service'] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export const ROOM_NIGHT_STATUSES = ['held', 'booked', 'blocked'] as const;
export type RoomNightStatus = (typeof ROOM_NIGHT_STATUSES)[number];

export const BOOKING_STATUSES = [
  'held',
  'confirmed',
  'checked_in',
  'checked_out',
  'cancelled',
  'expired',
  'no_show',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_SOURCES = ['web', 'walk_in'] as const;
export type BookingSource = (typeof BOOKING_SOURCES)[number];

export const PAYMENT_METHODS = ['pay_at_hotel', 'card_test'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PRICING_RULE_KINDS = ['weekend', 'season', 'long_stay', 'last_minute'] as const;
export type PricingRuleKind = (typeof PRICING_RULE_KINDS)[number];

export const USER_ROLES = ['guest', 'staff', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['active', 'suspended'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const DEFAULT_HOLD_MINUTES = 10;
export const DEFAULT_TAX_PERCENT = 18;
export const MAX_STAY_NIGHTS = 30;
export const MAX_ADVANCE_DAYS = 365;
