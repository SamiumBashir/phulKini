import { SignJWT, jwtVerify } from 'jose';

const AUTH_SECRET = process.env.AUTH_SECRET || 'phulkini_super_secret_jwt_key_2026_change_in_production';
const SECRET_KEY = new TextEncoder().encode(AUTH_SECRET);
const TOKEN_EXPIRY = '7d';

/**
 * Sign a JWT token containing user session payload
 * @param {Object} payload 
 * @returns {Promise<string>}
 */
export async function signAuthToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

/**
 * Verify a JWT token and extract payload
 * @param {string} token 
 * @returns {Promise<Object|null>}
 */
export async function verifyAuthToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}
