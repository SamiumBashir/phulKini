import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'কুপন কোড আবশ্যক'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      required: true,
      min: [1, 'কুপনের মান কমপক্ষে ১ হতে হবে']
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      default: null
    },
    usageLimit: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
