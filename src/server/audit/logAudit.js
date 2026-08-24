import connectToDatabase from '@/lib/db/mongodb';
import AuditLog from '@/models/AuditLog';

export async function logAudit({
  actorId = null,
  actorName = 'System',
  actorRole = 'SYSTEM',
  action,
  resource,
  resourceId = null,
  metadata = {},
  ip = '',
  userAgent = ''
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
      metadata,
      ip,
      userAgent
    });
  } catch (error) {
    console.error('Audit log failed to record:', error.message);
  }
}
