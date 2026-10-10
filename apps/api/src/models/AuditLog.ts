import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  actor?: mongoose.Types.ObjectId;
  action: string;
  target?: string;
  outcome: 'success' | 'denied';
  ip?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
  at: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true },
    target: { type: String },
    outcome: { type: String, enum: ['success', 'denied'], required: true, index: true },
    ip: { type: String },
    userAgent: { type: String },
    meta: { type: Schema.Types.Mixed },
    at: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  },
);

AuditLogSchema.index({ at: -1 });
AuditLogSchema.index({ actor: 1, at: -1 });
AuditLogSchema.index({ outcome: 1, at: -1 });

export const AuditLog: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
