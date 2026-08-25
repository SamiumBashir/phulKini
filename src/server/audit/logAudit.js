import connectToDatabase from '../../lib/db/mongodb.js';
import AuditLog from '../../models/AuditLog.js';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'secret', 'apiSecret', 'store_passwd', 'cvv', 'authSecret'];

/**
 * Recursively sanitize metadata object removing any sensitive fields
 */
function sanitizeMetadata(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMetadata);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeMetadata(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export async function logAudit({
  actorId = null,
  actorName = 'System',
  actorRole = 'SYSTEM',
  action,
  resource,
  resourceId = null,
  metadata = {},
  ip = '',
  userAgent = '',
  requestId = ''
}) {
  try {
    await connectToDatabase();
    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action,
      resource,
      resourceId,
      metadata: sanitizeMetadata(metadata),
      ip,
      userAgent,
      requestId
    });
  } catch (error) {
    console.error('Audit log failed to record:', error.message);
  }
}
