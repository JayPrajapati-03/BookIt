import mongoose, { Schema, type Document, type Model } from 'mongoose';

/** One row per room per calendar date — the availability ledger */
export interface IRoomNight extends Document {
  _id: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  roomType: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  date: Date; // midnight UTC
  booking?: mongoose.Types.ObjectId;
  status: 'occupied' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const RoomNightSchema = new Schema<IRoomNight>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: Date, required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    status: { type: String, enum: ['occupied', 'blocked'], default: 'occupied' },
  },
  { timestamps: true },
);

// The critical unique compound index that prevents double-booking
RoomNightSchema.index({ room: 1, date: 1 }, { unique: true });
RoomNightSchema.index({ hotel: 1, date: 1 });
RoomNightSchema.index({ booking: 1 });
RoomNightSchema.index({ roomType: 1, date: 1 });

export const RoomNight: Model<IRoomNight> = mongoose.model<IRoomNight>(
  'RoomNight',
  RoomNightSchema,
);
