import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { ROOM_STATUSES, type RoomStatus } from '@bookit/shared';

export interface IRoom extends Document {
  _id: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  roomType: mongoose.Types.ObjectId;
  number: string;
  floor: number;
  status: RoomStatus;
  isSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
    number: { type: String, required: true, trim: true },
    floor: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ROOM_STATUSES,
      default: 'active',
      required: true,
    },
    isSeed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

RoomSchema.index({ hotel: 1, number: 1 }, { unique: true });
RoomSchema.index({ roomType: 1, status: 1 });

export const Room: Model<IRoom> = mongoose.model<IRoom>('Room', RoomSchema);
