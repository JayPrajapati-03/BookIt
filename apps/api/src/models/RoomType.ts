import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IRoomType extends Document {
  _id: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  maxGuests: number;
  beds: string;
  sizeSqm: number;
  amenities: string[];
  images: Array<{ url: string; publicId?: string; alt?: string }>;
  basePricePaise: number;
  unitCount: number;
  isActive: boolean;
  isSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomTypeSchema = new Schema<IRoomType>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    maxGuests: { type: Number, required: true, min: 1, default: 2 },
    beds: { type: String, required: true, default: '1 King Bed' },
    sizeSqm: { type: Number, required: true, default: 35 },
    amenities: [{ type: String, trim: true }],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String },
      },
    ],
    basePricePaise: { type: Number, required: true, min: 0 },
    unitCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    isSeed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

RoomTypeSchema.index({ hotel: 1, isActive: 1 });
RoomTypeSchema.index({ hotel: 1, slug: 1 }, { unique: true });

export const RoomType: Model<IRoomType> = mongoose.model<IRoomType>('RoomType', RoomTypeSchema);
