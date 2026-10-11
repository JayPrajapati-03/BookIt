import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  rating: number; // 1-5
  title: string;
  body: string;
  categories: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
  };
  staffResponse?: {
    body: string;
    respondedAt: Date;
    respondedBy: mongoose.Types.ObjectId;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    categories: {
      cleanliness: { type: Number, min: 1, max: 5, default: 5 },
      comfort: { type: Number, min: 1, max: 5, default: 5 },
      location: { type: Number, min: 1, max: 5, default: 5 },
      service: { type: Number, min: 1, max: 5, default: 5 },
      value: { type: Number, min: 1, max: 5, default: 5 },
    },
    staffResponse: {
      body: { type: String },
      respondedAt: { type: Date },
      respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ReviewSchema.index({ hotel: 1, isPublished: 1, createdAt: -1 });
ReviewSchema.index({ booking: 1 }, { unique: true }); // One review per booking
ReviewSchema.index({ author: 1 });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
