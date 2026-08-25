import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
      default: null
    },
    nameSnapshot: {
      type: String,
      required: true
    },
    englishNameSnapshot: {
      type: String,
      default: ''
    },
    imageSnapshot: {
      type: String,
      default: ''
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    customBouquetDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
      },
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
      altPhone: { type: String, default: '' },
      email: { type: String, default: '' }
    },
    items: [OrderItemSchema],
    delivery: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String, default: '' },
      address: { type: String, required: true },
      area: { type: String, default: 'বনানী' },
      city: { type: String, default: 'ঢাকা' },
      zone: { type: String, default: 'dhaka_inside' },
      date: { type: String, required: true },
      timeSlot: { type: String, default: 'morning' },
      giftMessage: { type: String, default: '' },
      instructions: { type: String, default: '' }
    },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      deliveryFee: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 }
    },
    coupon: {
      code: { type: String, default: null },
      discount: { type: Number, default: 0 }
    },
    payment: {
      method: {
        type: String,
        enum: ['bkash', 'nagad', 'card', 'cod'],
        default: 'cod'
      },
      status: {
        type: String,
        enum: ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'UNPAID',
        index: true
      },
      transactionId: { type: String, default: null },
      valId: { type: String, default: null },
      bankTranId: { type: String, default: null },
      cardType: { type: String, default: null },
      paidAt: { type: Date, default: null }
    },
    status: {
      type: String,
      enum: [
        'PENDING_PAYMENT',
        'CONFIRMED',
        'PROCESSING',
        'READY_FOR_DELIVERY',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
      ],
      default: 'CONFIRMED',
      index: true
    },
    inventoryReserved: {
      type: Boolean,
      default: true
    },
    inventoryReleased: {
      type: Boolean,
      default: false
    },
    idempotencyKey: {
      type: String,
      default: null,
      index: true
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        updatedBy: { type: String, default: 'SYSTEM' }
      }
    ]
  },
  {
    timestamps: true
  }
);

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'customer.phone': 1, orderNumber: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
