import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/models/Category';
import { CATEGORIES as FALLBACK_CATEGORIES } from '@/data/categories';
import { getServerSession, hasPermission } from '@/lib/security/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

    if (categories.length === 0) {
      return NextResponse.json({
        success: true,
        categories: FALLBACK_CATEGORIES
      });
    }

    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({
        ...c,
        id: c._id.toString()
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      categories: FALLBACK_CATEGORIES
    });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস!' },
        { status: 403 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const category = await Category.create(body);

    return NextResponse.json({
      success: true,
      category,
      message: 'ক্যাটাগরি সফলভাবে যুক্ত হয়েছে'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'ক্যাটাগরি তৈরিতে সমস্যা' },
      { status: 500 }
    );
  }
}
