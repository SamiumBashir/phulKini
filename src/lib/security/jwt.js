import { SignJWT, jwtVerify } from 'jose';
import { ENV } from '../config/env.js';

const SECRET_KEY = new TextEncoder().encode(ENV.AUTH.SECRET);
const TOKEN_EXPIRY = ENV.AUTH.TOKEN_EXPIRES_IN || '7d';
const ISSUER = 'phulkini:auth';
const AUDIENCE = 'phulkini:app';

/**
 * Sign a secure JWT session token
 * @param {Object} payload - User session data (id, email, name, role)
 * @returns {Promise<string>}
 */
export async function signAuthToken(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid JWT payload provided');
  }

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

/**
 * Verify a JWT session token and extract verified claims
 * @param {string} token - Raw JWT string
 * @returns {Promise<Object|null>}
 */
export async function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      issuer: ISSUER,
      audience: AUDIENCE
    });
    return payload;
  } catch (error) {
    // Return null on invalid signature, expired, or malformed tokens
    return null;
  }
}
