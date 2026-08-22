import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: 'ফুল কিনি ফুলের তোড়া' },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 800 }
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'পণ্যের বাংলা নাম আবশ্যক'],
      trim: true,
      maxlength: [150, 'নাম ১৫০ অক্ষরের বেশি হতে পারবে না']
    },
    englishName: {
      type: String,
      trim: true,
      default: ''
    },
    slug: {
      type: String,
      required: [true, 'স্লাগ আবশ্যক'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'ক্যাটাগরি আবশ্যক'],
      index: true,
      default: 'bouquets'
    },
    categoryName: {
      type: String,
      default: 'ফুলের তোড়া'
    },
    price: {
      type: Number,
      required: [true, 'বিক্রয় মূল্য আবশ্যক'],
      min: [0, 'মূল্য ঋণাত্মক হতে পারে না']
    },
    compareAtPrice: {
      type: Number,
      default: null
    },
    originalPrice: {
      type: Number,
      default: null
    },
    discountPercent: {
      type: Number,
      default: 0
    },
    images: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: [0, 'স্টক ঋণাত্মক হতে পারে না']
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isBestseller: {
      type: Boolean,
      default: false,
      index: true
    },
    isNew: {
      type: Boolean,
      default: true
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    stemCount: {
      type: String,
      default: '১২টি তাজা ফুল ও ফিলার'
    },
    lifespan: {
      type: String,
      default: '৫-৭ দিন'
    },
    fragrance: {
      type: String,
      default: 'তাজা ও মিষ্টি প্রাকৃতিক সুবাস'
    },
    wrapping: {
      type: String,
      default: 'সিগনেচার লাক্সারি ম্যাট বার্গান্ডি র‍্যাপিং'
    },
    occasions: {
      type: [String],
      default: ['love', 'birthday']
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 12
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

// Calculate discount automatically
ProductSchema.pre('save', function (next) {
  const original = this.originalPrice || this.compareAtPrice;
  if (original && original > this.price) {
    this.discountPercent = Math.round(((original - this.price) / original) * 100);
  } else {
    this.discountPercent = 0;
  }
  this.inStock = this.stock > 0 && this.isAvailable;
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
