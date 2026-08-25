import { NextResponse } from 'next/server.js';

/**
 * Standardized API Response and Error Handling for Phul Kini v2
 */

export function generateRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Success JSON Response
 * @param {Object} data - Payload data or message
 * @param {number} [status=200]
 * @param {Object} [headers]
 */
export function successResponse(data = {}, status = 200, headers = {}) {
  return NextResponse.json(
    {
      success: true,
      ...data
    },
    { status, headers }
  );
}

/**
 * Standard Error JSON Response
 * @param {string} message - User-friendly Bengali error message
 * @param {number} [status=500]
 * @param {string} [requestId]
 * @param {Array} [errors] - Optional validation errors
 */
export function errorResponse(message, status = 500, requestId = null, errors = null) {
  const reqId = requestId || generateRequestId();
  const responseBody = {
    success: false,
    message: message || 'সার্ভারে একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    requestId: reqId
  };

  if (errors && Array.isArray(errors)) {
    responseBody.errors = errors;
  }

  return NextResponse.json(responseBody, { status });
}

/**
 * Wrapper for API Route Handlers providing centralized error interception and logging
 * @param {Function} handler - Async function (request, context) => NextResponse
 * @param {string} [endpointName] - Name for structured logging
 */
export function withApiHandler(handler, endpointName = 'API') {
  return async (request, context) => {
    const requestId = generateRequestId();
    try {
      return await handler(request, context, requestId);
    } catch (error) {
      const isDev = process.env.NODE_ENV !== 'production';

      // Structured server-side error log
      console.error(`[${endpointName} ERROR] [${requestId}]:`, {
        name: error.name,
        message: error.message,
        stack: isDev ? error.stack : undefined,
        url: request?.url,
        method: request?.method
      });

      // Sanitized error response
      const statusCode = error.status || error.statusCode || 500;
      const userMessage =
        isDev || error.isOperational
          ? error.message
          : 'সার্ভারে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';

      return errorResponse(userMessage, statusCode, requestId);
    }
  };
}

export class OperationalError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'OperationalError';
    this.status = status;
    this.isOperational = true;
  }
}
