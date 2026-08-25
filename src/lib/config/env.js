/**
 * Strict Environment Configuration Manager for Phul Kini v2
 * Validates required environment variables and ensures zero silent fallback secrets in production.
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get a required environment variable. Throws an error if missing.
 * @param {string} key
 * @param {string} [defaultValue] - Only permitted in non-production environments
 * @returns {string}
 */
export function getRequiredEnv(key, defaultValue = undefined) {
  const value = process.env[key];

  if (value !== undefined && value !== '') {
    return value;
  }

  if (!isProduction && defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`[CRITICAL CONFIG ERROR] Required environment variable "${key}" is missing or empty.`);
}

/**
 * Get an optional environment variable with a default value.
 * @param {string} key
 * @param {string} [defaultValue]
 * @returns {string}
 */
export function getOptionalEnv(key, defaultValue = '') {
  const value = process.env[key];
  return value !== undefined && value !== '' ? value : defaultValue;
}

// ----------------------------------------------------
// Categorized Configuration Object
// ----------------------------------------------------

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: isProduction,

  APP: {
    URL: getOptionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    PORT: parseInt(getOptionalEnv('PORT', '3000'), 10)
  },

  DATABASE: {
    MONGODB_URI: getRequiredEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/phul_kini'),
    MONGODB_DB: getOptionalEnv('MONGODB_DB', 'phul_kini')
  },

  AUTH: {
    SECRET: getRequiredEnv(
      'AUTH_SECRET',
      isProduction ? undefined : 'phulkini_development_jwt_secret_must_be_over_32_characters_long'
    ),
    TOKEN_EXPIRES_IN: getOptionalEnv('AUTH_TOKEN_EXPIRES_IN', '7d'),
    COOKIE_NAME: 'phulkini_auth_token'
  },

  PAYMENTS: {
    SSLCOMMERZ_STORE_ID: getOptionalEnv('SSLCOMMERZ_STORE_ID', ''),
    SSLCOMMERZ_STORE_PASSWORD: getOptionalEnv('SSLCOMMERZ_STORE_PASSWORD', ''),
    SSLCOMMERZ_IS_LIVE: getOptionalEnv('SSLCOMMERZ_IS_LIVE', 'false') === 'true',
    PAYMENT_SIMULATION: getOptionalEnv('PAYMENT_SIMULATION', isProduction ? 'false' : 'false') === 'true'
  },

  CLOUDINARY: {
    CLOUD_NAME: getOptionalEnv('CLOUDINARY_CLOUD_NAME', getOptionalEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', '')),
    API_KEY: getOptionalEnv('CLOUDINARY_API_KEY', ''),
    API_SECRET: getOptionalEnv('CLOUDINARY_API_SECRET', ''),
    UPLOAD_FOLDER: 'phulkini_products'
  },

  REDIS: {
    URL: getOptionalEnv('REDIS_URL', '')
  },

  CRON: {
    SECRET: getOptionalEnv('CRON_SECRET', '')
  }
};

// Validate entropy of AUTH_SECRET
if (ENV.AUTH.SECRET && ENV.AUTH.SECRET.length < 32) {
  if (isProduction) {
    throw new Error('[CRITICAL SECURITY ERROR] AUTH_SECRET must be at least 32 characters in production.');
  } else {
    console.warn('⚠️ [SECURITY WARNING] AUTH_SECRET is shorter than recommended 32 characters.');
  }
}

// Prohibit payment simulation in production
if (isProduction && ENV.PAYMENTS.PAYMENT_SIMULATION) {
  throw new Error('[CRITICAL SECURITY ERROR] PAYMENT_SIMULATION is strictly prohibited in production.');
}

export default ENV;
