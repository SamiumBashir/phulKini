import { cookies } from 'next/headers';
import { verifyAuthToken } from './jwt.js';

export const AUTH_COOKIE_NAME = 'phulkini_auth_token';

/**
 * Get verified server session from cookies
 * @param {Request} [request] 
 * @returns {Promise<Object|null>}
 */
export async function getServerSession(request) {
  let token = null;

  if (request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

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
  if (!session) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;

  // SUPER_ADMIN has full permissions everywhere
  if (session.role === 'SUPER_ADMIN') return true;

  return allowedRoles.includes(session.role);
}
