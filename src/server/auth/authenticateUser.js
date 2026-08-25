import bcrypt from 'bcryptjs';
import connectToDatabase from '../../lib/db/mongodb.js';
import User from '../../models/User.js';
import { signAuthToken } from '../../lib/security/jwt.js';
import { logAudit } from '../audit/logAudit.js';

/**
 * Authenticate user with email and password strictly against MongoDB
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @param {string} [credentials.ip]
 * @param {string} [credentials.userAgent]
 * @returns {Promise<{ success: boolean, message?: string, token?: string, user?: Object }>}
 */
export async function authenticateUser({ email, password, ip = '', userAgent = '' }) {
  if (!email || !password) {
    return { success: false, message: 'ইমেইল এবং পাসওয়ার্ড আবশ্যক' };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Audit failed attempt
      await logAudit({
        actorName: 'Anonymous',
        actorRole: 'ANONYMOUS',
        action: 'FAILED_LOGIN',
        resource: 'AUTH',
        metadata: { email: normalizedEmail, reason: 'USER_NOT_FOUND' },
        ip,
        userAgent
      }).catch(() => {});

      return { success: false, message: 'ভুল ইমেইল অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।' };
    }

    if (!user.isActive) {
      await logAudit({
        actorId: user._id,
        actorName: user.name,
        actorRole: user.role,
        action: 'FAILED_LOGIN',
        resource: 'AUTH',
        metadata: { email: normalizedEmail, reason: 'ACCOUNT_DISABLED' },
        ip,
        userAgent
      }).catch(() => {});

      return { success: false, message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে নিষ্ক্রিয় করা আছে। সাপোর্টে যোগাযোগ করুন।' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logAudit({
        actorId: user._id,
        actorName: user.name,
        actorRole: user.role,
        action: 'FAILED_LOGIN',
        resource: 'AUTH',
        metadata: { email: normalizedEmail, reason: 'INVALID_PASSWORD' },
        ip,
        userAgent
      }).catch(() => {});

      return { success: false, message: 'ভুল ইমেইল অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।' };
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save().catch(() => {});

    const sessionPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || ''
    };

    const token = await signAuthToken(sessionPayload);

    await logAudit({
      actorId: user._id,
      actorName: user.name,
      actorRole: user.role,
      action: 'LOGIN',
      resource: 'AUTH',
      metadata: { email: user.email, role: user.role },
      ip,
      userAgent
    }).catch(() => {});

    return {
      success: true,
      token,
      user: sessionPayload
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'লগইন প্রক্রিয়ায় ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।' };
  }
}
