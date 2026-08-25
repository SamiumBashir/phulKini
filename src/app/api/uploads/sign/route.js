import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireRole } from '@/lib/security/auth';
import { ENV } from '@/lib/config/env';
import { withApiHandler, OperationalError } from '@/lib/errors/apiHandler';

const CLOUD_NAME = ENV.CLOUDINARY.CLOUD_NAME;
const API_KEY = ENV.CLOUDINARY.API_KEY;
const API_SECRET = ENV.CLOUDINARY.API_SECRET;

if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
  });
}

export const POST = withApiHandler(async (request) => {
  // 1. Enforce admin role authentication
  await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR']);

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new OperationalError('ক্লাউডিনারি মিডিয়া স্টোরেজ ক্রেডেনশিয়াল সার্ভারে কনফিগার করা নেই।', 500);
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = ENV.CLOUDINARY.UPLOAD_FOLDER || 'phulkini_products';

  // Strict signature generation with constrained parameters
  const paramsToSign = {
    folder,
    timestamp
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, API_SECRET);

  return NextResponse.json({
    success: true,
    signature,
    timestamp,
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    folder
  });
}, 'UPLOADS_SIGN');
