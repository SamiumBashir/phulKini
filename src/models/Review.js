import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'মন্তব্য ১০০০ অক্ষরের বেশি হতে পারবে না']
    },
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
