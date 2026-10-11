import mongoose, { Schema, type Document, type Model } from 'mongoose';
import {
  PROPERTY_TYPES,
  HOTEL_STATUSES,
  type PropertyType,
  type HotelStatus,
} from '@bookit/shared';

export interface IHotelImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IHotelPolicies {
  checkInTime: string;
  checkOutTime: string;
  freeCancellationHours: number;
  lateCancellationPenaltyPercent: number;
}

export interface IHotel extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  images: IHotelImage[];
  amenities: string[];
  starRating: number;
  propertyType: PropertyType;
  policies: IHotelPolicies;
  status: HotelStatus;
  ratingAvg: number;
  ratingCount: number;
  fromPricePaise: number;
  isSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String },
      },
    ],
    amenities: [{ type: String, trim: true }],
    starRating: { type: Number, min: 1, max: 5, default: 4 },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      required: true,
    },
    policies: {
      checkInTime: { type: String, default: '14:00' },
      checkOutTime: { type: String, default: '11:00' },
      freeCancellationHours: { type: Number, default: 48 },
      lateCancellationPenaltyPercent: { type: Number, default: 50 },
    },
    status: {
      type: String,
      enum: HOTEL_STATUSES,
      default: 'published',
      required: true,
    },
    ratingAvg: { type: Number, default: 4.8, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    fromPricePaise: { type: Number, default: 0 },
    isSeed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Required indexes per B3 & ARCHITECTURE
HotelSchema.index({ slug: 1 }, { unique: true });
HotelSchema.index({ status: 1, city: 1, fromPricePaise: 1 });
HotelSchema.index({ location: '2dsphere' });
HotelSchema.index({ ratingAvg: -1 });
HotelSchema.index(
  { name: 'text', tagline: 'text', city: 'text', description: 'text' },
  { weights: { name: 10, city: 5, tagline: 3, description: 1 } },
);

export const Hotel: Model<IHotel> = mongoose.model<IHotel>('Hotel', HotelSchema);
