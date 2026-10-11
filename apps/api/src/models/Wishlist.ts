import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

WishlistSchema.index({ user: 1, hotel: 1 }, { unique: true });

export const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
