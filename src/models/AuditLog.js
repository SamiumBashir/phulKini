import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    actorName: {
      type: String,
      default: 'Anonymous / System'
    },
    actorRole: {
      type: String,
      default: 'SYSTEM'
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    resource: {
      type: String,
      required: true,
      index: true
    },
    resourceId: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ip: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
