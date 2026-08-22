import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'নাম আবশ্যক'],
      trim: true,
      maxlength: [100, 'নাম ১০০ অক্ষরের বেশি হতে পারবে না']
    },
    email: {
      type: String,
      required: [true, 'ইমেইল আবশ্যক'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'সঠিক ইমেইল দিন']
    },
    passwordHash: {
      type: String,
      required: [true, 'পাসওয়ার্ড আবশ্যক']
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR', 'CUSTOMER'],
      default: 'CUSTOMER'
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Prevent recompilation of model in hot reloads
export default mongoose.models.User || mongoose.model('User', UserSchema);
