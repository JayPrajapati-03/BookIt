import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus } from '@bookit/shared';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLoginAt?: Date;
  failedLogins: number;
  lockedUntil?: Date;
  isSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'guest',
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'active',
      required: true,
    },
    avatarUrl: { type: String },
    lastLoginAt: { type: Date },
    failedLogins: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    isSeed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
