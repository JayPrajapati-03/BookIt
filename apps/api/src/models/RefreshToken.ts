import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IRefreshToken extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  family: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  replacedBy?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    family: { type: String, required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedBy: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  },
);

RefreshTokenSchema.index({ tokenHash: 1 }, { unique: true });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Mongo TTL index
RefreshTokenSchema.index({ family: 1 });
RefreshTokenSchema.index({ user: 1 });

export const RefreshToken: Model<IRefreshToken> = mongoose.model<IRefreshToken>(
  'RefreshToken',
  RefreshTokenSchema,
);
