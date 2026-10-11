import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type PricingRuleType =
  'base' | 'seasonal' | 'day_of_week' | 'early_bird' | 'last_minute' | 'minimum_stay';
export type AdjustmentType = 'percent' | 'fixed';

export interface IPricingRule extends Document {
  _id: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  roomType?: mongoose.Types.ObjectId; // null = applies to all room types
  name: string;
  ruleType: PricingRuleType;
  priority: number; // Higher wins; base is 0
  // Date range applicability
  validFrom?: Date;
  validTo?: Date;
  // Day-of-week mask (0=Sun … 6=Sat)
  daysOfWeek?: number[];
  // Lead time
  minLeadDays?: number;
  maxLeadDays?: number;
  // Minimum stay
  minNights?: number;
  // Adjustment
  adjustmentType: AdjustmentType;
  adjustmentValue: number; // percent (e.g., 20 = +20%) or fixed paise
  isActive: boolean;
  isSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingRuleSchema = new Schema<IPricingRule>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: Schema.Types.ObjectId, ref: 'RoomType', default: null },
    name: { type: String, required: true, trim: true },
    ruleType: {
      type: String,
      enum: ['base', 'seasonal', 'day_of_week', 'early_bird', 'last_minute', 'minimum_stay'],
      required: true,
    },
    priority: { type: Number, default: 0 },
    validFrom: { type: Date },
    validTo: { type: Date },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    minLeadDays: { type: Number },
    maxLeadDays: { type: Number },
    minNights: { type: Number },
    adjustmentType: { type: String, enum: ['percent', 'fixed'], required: true },
    adjustmentValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isSeed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PricingRuleSchema.index({ hotel: 1, isActive: 1, priority: -1 });
PricingRuleSchema.index({ hotel: 1, roomType: 1, isActive: 1 });

export const PricingRule: Model<IPricingRule> = mongoose.model<IPricingRule>(
  'PricingRule',
  PricingRuleSchema,
);
