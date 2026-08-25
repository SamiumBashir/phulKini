import { cookies } from 'next/headers';
import { verifyAuthToken } from './jwt.js';
import { ENV } from '../config/env.js';
import { OperationalError } from '../errors/apiHandler.js';

export const AUTH_COOKIE_NAME = ENV.AUTH.COOKIE_NAME;

/**
 * Extract and verify server session from HTTP cookies
 * @param {Request} [request] - Optional Next.js Request
 * @returns {Promise<Object|null>}
 */
export async function getServerSession(request) {
  let token = null;

  if (request) {
    // 1. Check Cookie header from Request
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    }

    // 2. Check Authorization Bearer Header if present
    if (!token) {
      const authHeader = request.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }
  }

  // 3. Fallback to Next.js cookie store
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch (e) {}
  }

  if (!token) return null;
  return await verifyAuthToken(token);
}

/**
 * Check if session has required role permission
 * @param {Object} session
 * @param {Array<string>} [allowedRoles]
 * @returns {boolean}
 */
export function hasPermission(session, allowedRoles = []) {
  if (!session || !session.role) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;

  // SUPER_ADMIN has full access
  if (session.role === 'SUPER_ADMIN') return true;

  return allowedRoles.includes(session.role);
}

/**
 * Guard that enforces authentication, throwing OperationalError if invalid
 * @param {Request} [request]
 * @returns {Promise<Object>} session
 */
export async function requireAuth(request) {
  const session = await getServerSession(request);
  if (!session) {
    throw new OperationalError('অননুমোদিত অ্যাক্সেস! অনুগ্রহ করে লগইন করুন।', 401);
  }
  return session;
}

/**
 * Guard that enforces specific role permissions
 * @param {Request} request
 * @param {Array<string>} allowedRoles
 * @returns {Promise<Object>} session
 */
export async function requireRole(request, allowedRoles = []) {
  const session = await requireAuth(request);
  if (!hasPermission(session, allowedRoles)) {
    throw new OperationalError('আপনার এই কাজটি সম্পাদনের অনুমতি নেই।', 403);
  }
  return session;
}
