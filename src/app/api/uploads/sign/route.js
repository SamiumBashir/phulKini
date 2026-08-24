import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession, hasPermission } from '@/lib/security/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'phulkini',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder_secret'
});

export async function POST(request) {
  try {
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস! মিডিয়া আপলোডের অনুমতি নেই।' },
        { status: 403 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'phulkini_products';

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder
      },
      process.env.CLOUDINARY_API_SECRET || 'placeholder_secret'
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'phulkini',
      apiKey: process.env.CLOUDINARY_API_KEY || '123456789012345',
      folder
    });
  } catch (error) {
    console.error('Cloudinary signing error:', error);
    return NextResponse.json(
      { success: false, message: 'আপলোড সিগনেচার তৈরিতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
