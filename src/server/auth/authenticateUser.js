import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/models/User';
import { signAuthToken } from '@/lib/security/jwt';
import { logAudit } from '@/server/audit/logAudit';

export async function authenticateUser({ email, password, ip = '', userAgent = '' }) {
  await connectToDatabase();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return { success: false, message: 'ভুল ইমেইল অথবা অ্যাকাউন্ট নিষ্ক্রিয় রয়েছে' };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return { success: false, message: 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' };
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  const sessionPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone
  };

  const token = await signAuthToken(sessionPayload);

  await logAudit({
    actorId: user._id,
    actorName: user.name,
    actorRole: user.role,
    action: 'LOGIN',
    resource: 'AUTH',
    metadata: { email: user.email },
    ip,
    userAgent
  });

  return {
    success: true,
    token,
    user: sessionPayload
  };
}
