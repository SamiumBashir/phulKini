import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'ক্যাটাগরির বাংলা নাম আবশ্যক'],
      trim: true
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
    icon: {
      type: String,
      default: '🌸'
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
