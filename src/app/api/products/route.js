import { NextResponse } from 'next/server';
import { getProducts } from '@/server/products/getProducts';
import { createProduct } from '@/server/products/createProduct';
import { getServerSession, hasPermission } from '@/lib/security/auth';
import { ProductCreateSchema } from '@/lib/validations/product';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const occasion = searchParams.get('occasion');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStockOnly = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'popular';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const result = await getProducts({
      category,
      occasion,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy,
      limit,
      skip
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'পণ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিন পণ্য তৈরি করতে পারবেন।' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = ProductCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || 'ভুল তথ্য প্রদান করা হয়েছে' },
        { status: 400 }
      );
    }

    const product = await createProduct(validation.data, session);

    return NextResponse.json({
      success: true,
      product,
      message: 'পণ্যটি সফলভাবে যুক্ত হয়েছে! 🌸'
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'পণ্য তৈরিতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
