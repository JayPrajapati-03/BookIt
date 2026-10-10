export interface AvailabilityChangedPayload {
  hotelId: string;
  roomTypeId: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  version: number;
}

export interface HotelViewersPayload {
  hotelId: string;
  count: number;
}

export interface BookingUpdatedPayload {
  bookingId: string;
  reference: string;
  status: string;
  version: number;
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminBookingPayload {
  bookingId: string;
  hotelId: string;
  reference: string;
  status: string;
  guestName: string;
  totalPaise: number;
  timestamp: string;
}

export interface AdminStatsPayload {
  hotelId?: string;
  inHouse: number;
  arrivalsToday: number;
  departuresToday: number;
  occupancyPercent: number;
}

export interface ServerToClientEvents {
  'availability:changed': (payload: AvailabilityChangedPayload) => void;
  'hotel:viewers': (payload: HotelViewersPayload) => void;
  'booking:updated': (payload: BookingUpdatedPayload) => void;
  'notification:new': (payload: NotificationPayload) => void;
  'admin:booking:new': (payload: AdminBookingPayload) => void;
  'admin:booking:updated': (payload: AdminBookingPayload) => void;
  'admin:stats': (payload: AdminStatsPayload) => void;
  'session:revoked': (payload: { reason: string }) => void;
}

export interface ClientToServerEvents {
  'hotel:subscribe': (payload: { hotelId: string }) => void;
  'hotel:unsubscribe': (payload: { hotelId: string }) => void;
}
