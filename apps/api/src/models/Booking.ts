import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type BookingStatus =
  'hold' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
export type CancellationActor = 'guest' | 'staff' | 'admin' | 'system';

export interface IGuestDetails {
  name: string;
  email: string;
  phone?: string;
  requests?: string;
}

export interface ICancellationInfo {
  cancelledAt: Date;
  actor: CancellationActor;
  reason?: string;
  refundPaise: number;
  penaltyPaise: number;
}

export interface IPolicySnapshot {
  freeCancellationHours: number;
  lateCancellationPenaltyPercent: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  reference: string;
  hotel: mongoose.Types.ObjectId;
  roomType: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId;
  guest: mongoose.Types.ObjectId;
  guestDetails: IGuestDetails;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  adults: number;
  children: number;
  totalPricePaise: number;
  policySnapshot: IPolicySnapshot;
  status: BookingStatus;
  idempotencyKey?: string;
  holdExpiresAt?: Date;
  cancellationInfo?: ICancellationInfo;
  isWalkIn: boolean;
  createdBy?: mongoose.Types.ObjectId;
  isSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    reference: { type: String, required: true, uppercase: true, trim: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    roomType: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    guest: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      requests: { type: String },
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    adults: { type: Number, required: true, min: 1, default: 1 },
    children: { type: Number, default: 0 },
    totalPricePaise: { type: Number, required: true, min: 0 },
    policySnapshot: {
      freeCancellationHours: { type: Number, required: true },
      lateCancellationPenaltyPercent: { type: Number, required: true },
      checkInTime: { type: String, required: true },
      checkOutTime: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['hold', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
      default: 'hold',
      required: true,
    },
    idempotencyKey: { type: String },
    holdExpiresAt: { type: Date, index: true },
    cancellationInfo: {
      cancelledAt: { type: Date },
      actor: { type: String, enum: ['guest', 'staff', 'admin', 'system'] },
      reason: { type: String },
      refundPaise: { type: Number },
      penaltyPaise: { type: Number },
    },
    isWalkIn: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isSeed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

BookingSchema.index({ reference: 1 }, { unique: true });
BookingSchema.index({ hotel: 1, status: 1, checkIn: 1 });
BookingSchema.index({ hotel: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ status: 1, holdExpiresAt: 1 });
BookingSchema.index({ guest: 1, status: 1 });
BookingSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);
