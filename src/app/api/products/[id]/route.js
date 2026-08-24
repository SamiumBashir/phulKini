import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/server/products/getProductBySlug';
import { updateProduct } from '@/server/products/updateProduct';
import { deleteProduct } from '@/server/products/deleteProduct';
import { getServerSession, hasPermission } from '@/lib/security/auth';
import { ProductUpdateSchema } from '@/lib/validations/product';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductBySlug(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'পণ্যটি খুঁজে পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'পণ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিন পণ্য সম্পাদনা করতে পারবেন।' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = ProductUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || 'ভুল তথ্য' },
        { status: 400 }
      );
    }

    const updated = await updateProduct(id, validation.data, session);

    return NextResponse.json({
      success: true,
      product: updated,
      message: 'পণ্য সফলভাবে আপডেট হয়েছে! 🌸'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'পণ্য আপডেটে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস! শুধুমাত্র সুপার অ্যাডমিন বা অ্যাডমিন পণ্য মুছে ফেলতে পারবেন।' },
        { status: 403 }
      );
    }

    await deleteProduct(id, session);

    return NextResponse.json({
      success: true,
      message: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'পণ্য মুছে ফেলতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
